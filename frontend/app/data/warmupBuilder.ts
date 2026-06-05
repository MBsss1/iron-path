import {
  getExercise,
  type Exercise,
  type LocalizedText,
} from "./exercises";
import type { FitnessLevel } from "./fitnessAssessment";
import type { DayType, GeneratedExercise } from "./workoutGeneratorV2";

export type WarmupBuildContext = {
  input: {
    equipment: string[];
    limitations: string[];
    weight: number;
  };
  result: { overallLevel: FitnessLevel };
  dayType: DayType;
};

/** Strength and conditioning work — never in warm-up. */
export const BANNED_WARMUP_EXERCISE_IDS = new Set([
  "pullups",
  "negative_pullups",
  "australian_rows",
  "pushups",
  "incline_pushups",
  "incline_pushup_warmup",
  "knee_pushups",
  "chair_squats",
  "bodyweight_squats",
  "squats",
  "lunges",
  "dips",
  "plank",
  "easy_run",
  "intervals",
  "jumping_jacks",
  "light_jog",
]);

export const ALLOWED_WARMUP_EXERCISE_IDS = new Set([
  "arm_circles",
  "shoulder_rolls",
  "elbow_rotations",
  "wrist_rotations",
  "wall_slides",
  "hip_circles",
  "leg_swings",
  "ankle_rotations",
  "knee_rotations",
  "bird_dog",
  "dead_bug_light",
  "scapular_pulls",
  "marching",
  "brisk_walk",
]);

const WARMUP_PRESCRIPTIONS: Record<string, LocalizedText> = {
  arm_circles: { en: "60 sec", ru: "60 сек" },
  shoulder_rolls: { en: "60 sec", ru: "60 сек" },
  elbow_rotations: { en: "45 sec", ru: "45 сек" },
  wrist_rotations: { en: "45 sec", ru: "45 сек" },
  wall_slides: { en: "10 reps", ru: "10 повторений" },
  hip_circles: { en: "60 sec", ru: "60 сек" },
  leg_swings: { en: "10 each leg", ru: "10 на каждую ногу" },
  ankle_rotations: { en: "45 sec", ru: "45 сек" },
  knee_rotations: { en: "45 sec", ru: "45 сек" },
  bird_dog: { en: "8 each side", ru: "8 на сторону" },
  dead_bug_light: { en: "8 each side", ru: "8 на сторону" },
  scapular_pulls: { en: "10 reps", ru: "10 повторений" },
  marching: { en: "90 sec", ru: "90 сек" },
  brisk_walk: { en: "90 sec", ru: "90 сек" },
};

const WARMUP_DURATION_SECONDS: Record<string, number> = {
  arm_circles: 60,
  shoulder_rolls: 60,
  elbow_rotations: 45,
  wrist_rotations: 45,
  wall_slides: 50,
  hip_circles: 60,
  leg_swings: 50,
  ankle_rotations: 45,
  knee_rotations: 45,
  bird_dog: 70,
  dead_bug_light: 70,
  scapular_pulls: 50,
  marching: 90,
  brisk_walk: 90,
};

const DAY_PRIORITY: Record<DayType, string[]> = {
  pull: ["scapular_pulls", "shoulder_rolls"],
  push: ["arm_circles", "wrist_rotations"],
  legs: ["hip_circles", "ankle_rotations", "leg_swings"],
  easy_run: ["marching", "brisk_walk", "ankle_rotations"],
  intervals: ["marching", "brisk_walk", "ankle_rotations"],
  full_body: [
    "arm_circles",
    "hip_circles",
    "scapular_pulls",
    "leg_swings",
    "bird_dog",
  ],
  mobility: ["hip_circles", "shoulder_rolls", "bird_dog", "dead_bug_light"],
};

const FILL_POOL = [
  "elbow_rotations",
  "wall_slides",
  "knee_rotations",
  "dead_bug_light",
  "marching",
  "brisk_walk",
];

const DAY_TYPE_INDEX: Record<DayType, number> = {
  full_body: 0,
  push: 1,
  pull: 2,
  legs: 3,
  easy_run: 4,
  intervals: 5,
  mobility: 6,
};

function hasLimitation(ctx: WarmupBuildContext, id: string): boolean {
  return ctx.input.limitations.includes(id);
}

function hasEquipment(ctx: WarmupBuildContext, eq: string): boolean {
  return ctx.input.equipment.includes(eq);
}

function isHighImpactBlocked(ctx: WarmupBuildContext): boolean {
  return (
    hasLimitation(ctx, "knees") ||
    hasLimitation(ctx, "overweight") ||
    ctx.input.weight > 100
  );
}

function canUseWarmupExercise(ctx: WarmupBuildContext, exercise: Exercise): boolean {
  if (!ALLOWED_WARMUP_EXERCISE_IDS.has(exercise.id)) return false;
  if (BANNED_WARMUP_EXERCISE_IDS.has(exercise.id)) return false;

  if (exercise.contraindications) {
    for (const c of exercise.contraindications) {
      if (c !== "none" && hasLimitation(ctx, c)) return false;
    }
  }
  if (isHighImpactBlocked(ctx) && exercise.id === "leg_swings") return false;
  if (hasLimitation(ctx, "shoulders") && exercise.id === "scapular_pulls") {
    return false;
  }
  if (!hasEquipment(ctx, "pull_up_bar") && exercise.id === "scapular_pulls") {
    return false;
  }
  const needs = exercise.equipment.filter((e) => e !== "none");
  if (needs.length > 0) {
    const ok = needs.some((e) => hasEquipment(ctx, e));
    if (!ok) return false;
  }
  return true;
}

function getWarmupCount(level: FitnessLevel): { min: number; max: number } {
  switch (level) {
    case "absolute_beginner":
      return { min: 3, max: 4 };
    case "beginner":
      return { min: 4, max: 5 };
    case "novice":
      return { min: 5, max: 5 };
    default:
      return { min: 5, max: 6 };
  }
}

function rotatePool<T>(pool: T[], offset: number): T[] {
  if (pool.length === 0) return [];
  const start = offset % pool.length;
  return [...pool.slice(start), ...pool.slice(0, start)];
}

function toWarmupGenerated(exerciseId: string): GeneratedExercise {
  const ex = getExercise(exerciseId);
  const prescription = WARMUP_PRESCRIPTIONS[exerciseId] ?? {
    en: "30 sec",
    ru: "30 сек",
  };
  return {
    exerciseId,
    name: ex?.name ?? { en: exerciseId, ru: exerciseId },
    prescription,
    restSeconds: 0,
  };
}

export function buildWarmupExercises(ctx: WarmupBuildContext): GeneratedExercise[] {
  const { min, max } = getWarmupCount(ctx.result.overallLevel);
  const target =
    min +
    (DAY_TYPE_INDEX[ctx.dayType] + ctx.result.overallLevel.length) %
      (max - min + 1);

  const ordered: string[] = [];
  const seen = new Set<string>();

  const tryAdd = (id: string) => {
    if (seen.has(id) || !ALLOWED_WARMUP_EXERCISE_IDS.has(id)) return;
    const ex = getExercise(id);
    if (!ex || !canUseWarmupExercise(ctx, ex)) return;
    seen.add(id);
    ordered.push(id);
  };

  for (const id of DAY_PRIORITY[ctx.dayType]) tryAdd(id);

  const universal = ["arm_circles", "shoulder_rolls", "hip_circles"];
  for (const id of universal) {
    if (ordered.length >= target) break;
    tryAdd(id);
  }

  const fillOffset =
    DAY_TYPE_INDEX[ctx.dayType] * 2 + ctx.result.overallLevel.length;
  for (const id of rotatePool(FILL_POOL, fillOffset)) {
    if (ordered.length >= target) break;
    tryAdd(id);
  }

  return ordered.slice(0, target).map(toWarmupGenerated);
}

export function estimateWarmupSeconds(items: GeneratedExercise[]): number {
  return items.reduce(
    (sum, item) =>
      sum + (WARMUP_DURATION_SECONDS[item.exerciseId] ?? 35),
    0
  );
}

export function estimateWarmupMinutes(items: GeneratedExercise[]): number {
  const raw = Math.round(estimateWarmupSeconds(items) / 60);
  if (items.length === 0) return 5;
  return Math.min(7, Math.max(5, raw));
}
