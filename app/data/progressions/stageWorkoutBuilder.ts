import type { FitnessLevel } from "../fitnessAssessment";
import { resolveCardioTestType } from "../fitnessAssessment";
import { getExercise } from "../exercises";
import type { AssessmentInput, AssessmentResult } from "../fitnessAssessment";
import { normalizeFitnessGoal } from "../fitnessGoals";
import type { PathMode } from "../pathMode";
import type { DayType, GeneratedExercise } from "../workoutGeneratorV2";
import { getFocusTracksForDay } from "./goalPriorities";
import { filterAndPersonalizePool, type PersonalizationContext } from "./personalization";
import { capRunPrescription, isPullExerciseId } from "./runCap";
import { getStageBand } from "./stageEngine";
import {
  isSkippedCardioMode,
  isWalkCardioMode,
  metricFromInput,
} from "./types";
import type { ProgressionTrackId, StageExerciseSlot } from "./types";
import { getWalkStageBand } from "./walkProgression";

type BuilderContext = {
  input: AssessmentInput;
  result: AssessmentResult;
  dayType: DayType;
  pathMode: PathMode;
};

export type WeekBuildContext = {
  weekDayTypes: DayType[];
  excludeMainIds: Set<string>;
  fullBodyOccurrence: number;
};

const FULL_BODY_ROTATIONS: ProgressionTrackId[][] = [
  ["pullups", "pushups", "squats"],
  ["pushups", "squats", "plank"],
  ["squats", "pullups", "pushups"],
];

const LEVEL_RANK: Record<FitnessLevel, number> = {
  absolute_beginner: 0,
  beginner: 1,
  novice: 2,
  intermediate: 3,
  advanced: 4,
};

function maxMainExercises(level: FitnessLevel, dayType: DayType): number {
  const rank = LEVEL_RANK[level];
  if (rank <= LEVEL_RANK.absolute_beginner) {
    return dayType === "full_body" ? 4 : 3;
  }
  if (rank <= LEVEL_RANK.beginner) {
    return 4;
  }
  return dayType === "full_body" ? 5 : 4;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toGenerated(slot: {
  exerciseId: string;
  prescription: { en: string; ru: string };
  restSeconds: number;
}): GeneratedExercise {
  const ex = getExercise(slot.exerciseId);
  return {
    exerciseId: slot.exerciseId,
    name: ex?.name ?? { en: slot.exerciseId, ru: slot.exerciseId },
    prescription: slot.prescription,
    restSeconds: slot.restSeconds,
  };
}

function firstMobilityDayIndex(weekDayTypes: DayType[]): number {
  return weekDayTypes.findIndex((d) => d === "mobility");
}

function isFirstMobilityDay(
  sessionSeed: number,
  weekCtx?: WeekBuildContext
): boolean {
  if (!weekCtx) return sessionSeed === 0;
  const first = firstMobilityDayIndex(weekCtx.weekDayTypes);
  return first >= 0 && sessionSeed === first;
}

function filterRunningPool(
  ctx: PersonalizationContext,
  pool: StageExerciseSlot[],
  role: StageExerciseSlot["role"]
): StageExerciseSlot[] {
  let filtered = pool.filter((s) => s.role === role);

  if (isSkippedCardioMode(ctx.input)) {
    return filtered.filter((s) =>
      ["brisk_walk", "walk", "low_impact_conditioning"].includes(s.exerciseId)
    );
  }

  if (isWalkCardioMode(ctx.input)) {
    filtered = filtered.filter(
      (s) =>
        s.exerciseId !== "intervals" &&
        (s.exerciseId === "brisk_walk" ||
          s.exerciseId === "walk" ||
          s.prescription.en.toLowerCase().includes("walk") ||
          s.prescription.ru.includes("ходьб"))
    );
  }

  return filtered.map((s) => capRunPrescription(s, ctx.input));
}

function pickFromStagePool(
  ctx: PersonalizationContext,
  trackId: ProgressionTrackId,
  role: "main" | "accessory" | "conditioning",
  seed: number,
  maxItems: number,
  options?: { excludeIds?: Set<string>; input?: AssessmentInput }
): GeneratedExercise[] {
  const input = options?.input ?? ctx.input;
  const current =
    trackId === "running" && isWalkCardioMode(input)
      ? (input.walkMinutes ?? 0)
      : metricFromInput(input, trackId);

  const band =
    trackId === "running" && isWalkCardioMode(input)
      ? getWalkStageBand(current)
      : getStageBand(trackId, current, input);

  if (!band) return [];

  let pool = filterAndPersonalizePool(ctx, band.pool);
  if (trackId === "running") {
    pool = filterRunningPool(ctx, pool, role);
  } else {
    pool = pool.filter((s) => s.role === role);
  }

  if (pool.length === 0) return [];

  const offset = seed % Math.max(1, pool.length);
  const shuffled = [
    ...seededShuffle(pool, seed + trackId.length).slice(offset),
    ...seededShuffle(pool, seed + trackId.length).slice(0, offset),
  ];

  const seen = new Set<string>();
  const picked: GeneratedExercise[] = [];

  for (const slot of shuffled) {
    if (options?.excludeIds?.has(slot.exerciseId)) continue;
    if (seen.has(slot.exerciseId)) continue;
    seen.add(slot.exerciseId);
    picked.push(toGenerated(capRunPrescription(slot, ctx.input)));
    if (picked.length >= maxItems) break;
  }

  return picked;
}

function hasPullExercise(items: GeneratedExercise[]): boolean {
  return items.some((i) => isPullExerciseId(i.exerciseId));
}

function ensurePullFloor(
  items: GeneratedExercise[],
  pCtx: PersonalizationContext,
  sessionSeed: number,
  excludeIds?: Set<string>,
  maxTotal?: number
): GeneratedExercise[] {
  if (hasPullExercise(items)) return items;

  const pullPick = pickFromStagePool(
    pCtx,
    "pullups",
    "main",
    sessionSeed + 99,
    1,
    { excludeIds, input: pCtx.input }
  );
  if (pullPick.length === 0) return items;

  const merged = [...items, ...pullPick];
  if (maxTotal !== undefined) return merged.slice(0, maxTotal);
  return merged;
}

function buildFullBodyMain(
  ctx: BuilderContext,
  pCtx: PersonalizationContext,
  sessionSeed: number,
  weekCtx?: WeekBuildContext
): GeneratedExercise[] {
  const occurrence = weekCtx?.fullBodyOccurrence ?? sessionSeed;
  const rotation = FULL_BODY_ROTATIONS[occurrence % FULL_BODY_ROTATIONS.length];
  const excludeIds = weekCtx?.excludeMainIds;
  const maxMain = maxMainExercises(ctx.result.overallLevel, "full_body");
  const items: GeneratedExercise[] = [];

  for (const trackId of rotation) {
    const role = trackId === "plank" ? "accessory" : "main";
    const picked = pickFromStagePool(
      pCtx,
      trackId,
      role,
      sessionSeed + occurrence * 7 + trackId.charCodeAt(0),
      1,
      { excludeIds, input: ctx.input }
    );
    items.push(...picked);
  }

  const pushPresent = items.some((i) =>
    ["pushups", "knee_pushups", "incline_pushups", "wall_pushups", "decline_pushups", "pike_pushups", "dips"].includes(
      i.exerciseId
    )
  );
  const legsPresent = items.some((i) =>
    ["bodyweight_squats", "lunges", "split_squats", "chair_squats", "bulgarian_split_squats"].includes(
      i.exerciseId
    )
  );

  if (!pushPresent) {
    items.unshift(
      ...pickFromStagePool(pCtx, "pushups", "main", sessionSeed + 11, 1, {
        excludeIds,
        input: ctx.input,
      })
    );
  }
  if (!legsPresent) {
    items.push(
      ...pickFromStagePool(pCtx, "squats", "main", sessionSeed + 13, 1, {
        excludeIds,
        input: ctx.input,
      })
    );
  }

  let unique = dedupeExercises(items);

  if (ctx.pathMode === "self_development") {
    unique = ensurePullFloor(unique, pCtx, sessionSeed, excludeIds, maxMain);
  } else {
    unique = ensurePullFloor(unique, pCtx, sessionSeed, excludeIds, maxMain);
  }

  return unique.slice(0, maxMain);
}

function dedupeExercises(items: GeneratedExercise[]): GeneratedExercise[] {
  const map = new Map<string, GeneratedExercise>();
  for (const item of items) {
    if (!map.has(item.exerciseId)) map.set(item.exerciseId, item);
  }
  return [...map.values()];
}

export function buildStageMainExercises(
  ctx: BuilderContext,
  sessionSeed: number,
  weekCtx?: WeekBuildContext
): GeneratedExercise[] {
  const goal = normalizeFitnessGoal(ctx.input.goal);
  const pCtx: PersonalizationContext = { input: ctx.input, goal };

  if (ctx.dayType === "mobility") {
    return pickFromStagePool(pCtx, "plank", "main", sessionSeed, 2, {
      input: ctx.input,
    });
  }

  if (ctx.dayType === "easy_run" || ctx.dayType === "intervals") {
    return [
      ...pickFromStagePool(pCtx, "squats", "main", sessionSeed, 1, {
        input: ctx.input,
      }),
      ...pickFromStagePool(pCtx, "plank", "accessory", sessionSeed + 1, 1, {
        input: ctx.input,
      }),
    ];
  }

  if (ctx.dayType === "full_body") {
    return buildFullBodyMain(ctx, pCtx, sessionSeed, weekCtx);
  }

  const focusTracks = getFocusTracksForDay(goal, ctx.dayType);
  const maxPerTrack = ctx.dayType === "pull" || ctx.dayType === "push" || ctx.dayType === "legs" ? 3 : 2;
  const maxMain = maxMainExercises(ctx.result.overallLevel, ctx.dayType);
  const items: GeneratedExercise[] = [];

  for (const trackId of focusTracks) {
    if (ctx.dayType === "pull" && trackId !== "pullups" && trackId !== "plank") continue;
    if (ctx.dayType === "push" && trackId !== "pushups" && trackId !== "plank") continue;
    if (ctx.dayType === "legs" && trackId !== "squats" && trackId !== "plank") continue;

    items.push(
      ...pickFromStagePool(
        pCtx,
        trackId,
        "main",
        sessionSeed + trackId.charCodeAt(0),
        maxPerTrack,
        { excludeIds: weekCtx?.excludeMainIds, input: ctx.input }
      )
    );
  }

  return dedupeExercises(items).slice(0, maxMain);
}

export function buildStageAccessoryExercises(
  ctx: BuilderContext,
  sessionSeed: number
): GeneratedExercise[] {
  const goal = normalizeFitnessGoal(ctx.input.goal);
  const pCtx: PersonalizationContext = { input: ctx.input, goal };

  const items = pickFromStagePool(pCtx, "plank", "accessory", sessionSeed, 2, {
    input: ctx.input,
  });

  if (ctx.dayType === "pull") {
    items.push(
      ...pickFromStagePool(pCtx, "pullups", "accessory", sessionSeed + 3, 1, {
        input: ctx.input,
      })
    );
  }
  if (ctx.dayType === "legs") {
    items.push(
      ...pickFromStagePool(pCtx, "squats", "accessory", sessionSeed + 5, 1, {
        input: ctx.input,
      })
    );
  }

  return dedupeExercises(items).slice(0, 3);
}

function massGainConditioning(
  ctx: BuilderContext,
  sessionSeed: number,
  weekCtx: WeekBuildContext | undefined,
  pCtx: PersonalizationContext
): GeneratedExercise[] | undefined {
  const testType = resolveCardioTestType(ctx.input);

  if (testType === "skipped") {
    return undefined;
  }

  if (testType === "walk") {
    if (ctx.dayType !== "mobility" || !isFirstMobilityDay(sessionSeed, weekCtx)) {
      return undefined;
    }
    const walkMins = ctx.input.walkMinutes ?? 10;
    const duration = Math.min(walkMins + 5, 15);
    return [
      toGenerated({
        exerciseId: "brisk_walk",
        prescription: {
          en: `${duration} min brisk walk`,
          ru: `${duration} мин быстрая ходьба`,
        },
        restSeconds: 0,
      }),
    ];
  }

  if (testType === "run") {
    if (ctx.dayType === "easy_run" || ctx.dayType === "intervals") {
      const runItems = pickFromStagePool(
        pCtx,
        "running",
        "conditioning",
        sessionSeed,
        1,
        { input: ctx.input }
      );
      return runItems.length > 0 ? runItems : undefined;
    }
    if (ctx.dayType === "mobility" && isFirstMobilityDay(sessionSeed, weekCtx)) {
      const cap = (ctx.input.runMinutes ?? 5) + 2;
      return [
        toGenerated({
          exerciseId: "brisk_walk",
          prescription: {
            en: `${Math.min(cap, 10)} min brisk walk`,
            ru: `${Math.min(cap, 10)} мин быстрая ходьба`,
          },
          restSeconds: 0,
        }),
      ];
    }
    return undefined;
  }

  return undefined;
}

export function buildStageConditioningExercises(
  ctx: BuilderContext,
  sessionSeed: number,
  weekCtx?: WeekBuildContext
): GeneratedExercise[] | undefined {
  if (ctx.dayType === "mobility") {
    const goal = normalizeFitnessGoal(ctx.input.goal);
    if (goal === "mass_gain") {
      return massGainConditioning(ctx, sessionSeed, weekCtx, {
        input: ctx.input,
        goal,
      });
    }
    return undefined;
  }

  const goal = normalizeFitnessGoal(ctx.input.goal);
  const pCtx: PersonalizationContext = { input: ctx.input, goal };

  if (goal === "mass_gain") {
    return massGainConditioning(ctx, sessionSeed, weekCtx, pCtx);
  }

  if (isSkippedCardioMode(ctx.input) || ctx.input.cardioAccess === "none") {
    if (ctx.dayType === "easy_run" || ctx.dayType === "intervals") {
      return [
        toGenerated({
          exerciseId: "brisk_walk",
          prescription: {
            en: "12–15 min brisk walk",
            ru: "12–15 мин быстрая ходьба",
          },
          restSeconds: 0,
        }),
      ];
    }
    return undefined;
  }

  if (ctx.dayType === "intervals" && isWalkCardioMode(ctx.input)) {
    return [
      toGenerated({
        exerciseId: "brisk_walk",
        prescription: {
          en: "6 × (2 min brisk / 1 min easy)",
          ru: "6 × (2 мин быстрее / 1 мин легче)",
        },
        restSeconds: 0,
      }),
    ];
  }

  if (ctx.dayType === "easy_run" || ctx.dayType === "intervals") {
    const runItems = pickFromStagePool(
      pCtx,
      "running",
      "conditioning",
      sessionSeed,
      1,
      { input: ctx.input }
    );
    if (runItems.length > 0) return runItems;

    if (isWalkCardioMode(ctx.input)) {
      const walkMins = ctx.input.walkMinutes ?? 10;
      return [
        toGenerated({
          exerciseId: "brisk_walk",
          prescription: {
            en: `${Math.min(walkMins + 5, 20)} min brisk walk`,
            ru: `${Math.min(walkMins + 5, 20)} мин быстрая ходьба`,
          },
          restSeconds: 0,
        }),
      ];
    }
  }

  if (goal === "weight_loss" && ctx.dayType !== "pull") {
    const run = pickFromStagePool(pCtx, "running", "conditioning", sessionSeed, 1, {
      input: ctx.input,
    });
    if (run.length > 0) return run;
  }

  if (goal === "running" && !["easy_run", "intervals"].includes(ctx.dayType)) {
    const run = pickFromStagePool(pCtx, "running", "conditioning", sessionSeed, 1, {
      input: ctx.input,
    });
    if (run.length > 0) return run.slice(0, 1);
  }

  return undefined;
}

export type StageWorkoutMeta = {
  focusTrackIds: ProgressionTrackId[];
  stageLabels: string[];
};

export function getStageWorkoutMeta(
  input: AssessmentInput,
  _result: AssessmentResult,
  dayType: DayType,
  sessionSeed: number
): StageWorkoutMeta {
  const goal = normalizeFitnessGoal(input.goal);
  const focusTrackIds = getFocusTracksForDay(goal, dayType);
  const stageLabels = focusTrackIds
    .map((trackId) => {
      const current = metricFromInput(input, trackId);
      const band = getStageBand(trackId, current, input);
      if (!band) return "";
      return `${band.fromRung}→${band.toRung}`;
    })
    .filter(Boolean);

  void sessionSeed;
  return { focusTrackIds, stageLabels };
}
