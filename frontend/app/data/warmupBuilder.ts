import {
  getExercise,
  type Exercise,
  type LocalizedText,
} from "./exercises";
import type {
  CardioAccess,
  CardioPreference,
  FitnessLevel,
} from "./fitnessAssessment";
import type { DayType, GeneratedExercise } from "./workoutGeneratorV2";

export type WarmupLayer = "general" | "joints" | "activation";

export type WarmupBuildContext = {
  input: {
    equipment: string[];
    limitations: string[];
    weight: number;
    cardioAccess?: CardioAccess;
    cardioPreference?: CardioPreference;
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
  "marching",
  "brisk_walk",
  "arm_circles",
  "shoulder_rolls",
  "elbow_rotations",
  "wrist_rotations",
  "hip_circles",
  "knee_rotations",
  "ankle_rotations",
  "scapular_pulls",
  "dead_hang",
  "wall_slides",
  "leg_swings",
  "bird_dog",
  "dead_bug_light",
]);

const EXERCISE_LAYER: Record<string, WarmupLayer> = {
  marching: "general",
  brisk_walk: "general",
  arm_circles: "joints",
  shoulder_rolls: "joints",
  elbow_rotations: "joints",
  wrist_rotations: "joints",
  hip_circles: "joints",
  knee_rotations: "joints",
  ankle_rotations: "joints",
  scapular_pulls: "activation",
  dead_hang: "activation",
  wall_slides: "activation",
  leg_swings: "activation",
  bird_dog: "activation",
  dead_bug_light: "activation",
};

const WARMUP_PRESCRIPTIONS: Record<string, LocalizedText> = {
  marching: { en: "60 sec", ru: "60 сек" },
  brisk_walk: { en: "60 sec", ru: "60 сек" },
  arm_circles: { en: "30 sec", ru: "30 сек" },
  shoulder_rolls: { en: "30 sec", ru: "30 сек" },
  elbow_rotations: { en: "30 sec", ru: "30 сек" },
  wrist_rotations: { en: "30 sec", ru: "30 сек" },
  hip_circles: { en: "30 sec", ru: "30 сек" },
  knee_rotations: { en: "20 sec", ru: "20 сек" },
  ankle_rotations: { en: "20 sec", ru: "20 сек" },
  scapular_pulls: { en: "10 reps", ru: "10 повторений" },
  dead_hang: { en: "20–30 sec", ru: "20–30 сек" },
  wall_slides: { en: "10 reps", ru: "10 повторений" },
  leg_swings: { en: "10 each leg", ru: "10 на каждую ногу" },
  bird_dog: { en: "8 each side", ru: "8 на сторону" },
  dead_bug_light: { en: "8 each side", ru: "8 на сторону" },
};

const WARMUP_DURATION_SECONDS: Record<string, number> = {
  marching: 60,
  brisk_walk: 60,
  arm_circles: 30,
  shoulder_rolls: 30,
  elbow_rotations: 30,
  wrist_rotations: 30,
  hip_circles: 30,
  knee_rotations: 20,
  ankle_rotations: 20,
  scapular_pulls: 45,
  dead_hang: 25,
  wall_slides: 45,
  leg_swings: 40,
  bird_dog: 60,
  dead_bug_light: 60,
};

const REDUCED_GENERAL_SECONDS = 45;

type DayBlueprint = {
  general: string[];
  joints: string[];
  activation: string[];
};

/** Iron Path warmup standard — three layers per day type. */
const DAY_BLUEPRINTS: Record<DayType, DayBlueprint> = {
  pull: {
    general: ["marching"],
    joints: ["arm_circles", "shoulder_rolls"],
    activation: ["scapular_pulls", "dead_hang"],
  },
  push: {
    general: ["marching"],
    joints: ["arm_circles", "shoulder_rolls", "wrist_rotations"],
    activation: ["wall_slides"],
  },
  legs: {
    general: ["marching"],
    joints: ["hip_circles", "knee_rotations", "ankle_rotations"],
    activation: ["leg_swings"],
  },
  easy_run: {
    general: ["brisk_walk", "marching"],
    joints: ["hip_circles", "ankle_rotations"],
    activation: ["leg_swings"],
  },
  intervals: {
    general: ["brisk_walk", "marching"],
    joints: ["hip_circles", "ankle_rotations"],
    activation: ["leg_swings"],
  },
  full_body: {
    general: ["marching"],
    joints: ["arm_circles", "shoulder_rolls", "hip_circles", "ankle_rotations"],
    activation: ["bird_dog"],
  },
  mobility: {
    general: ["marching"],
    joints: ["hip_circles", "shoulder_rolls"],
    activation: ["bird_dog", "dead_bug_light"],
  },
};

const LEVEL_RANK: Record<FitnessLevel, number> = {
  absolute_beginner: 0,
  beginner: 1,
  novice: 2,
  intermediate: 3,
  advanced: 4,
};

const ACTIVATION_FALLBACKS: Record<string, string[]> = {
  scapular_pulls: ["wall_slides"],
  dead_hang: ["wall_slides"],
  leg_swings: ["bird_dog", "dead_bug_light"],
  wall_slides: ["shoulder_rolls"],
};

export function getWarmupLayer(exerciseId: string): WarmupLayer | null {
  return EXERCISE_LAYER[exerciseId] ?? null;
}

function hasLimitation(ctx: WarmupBuildContext, id: string): boolean {
  return ctx.input.limitations.includes(id);
}

function hasEquipment(ctx: WarmupBuildContext, eq: string): boolean {
  return ctx.input.equipment.includes(eq);
}

function hasBar(ctx: WarmupBuildContext): boolean {
  return hasEquipment(ctx, "pull_up_bar");
}

function isHighImpactBlocked(ctx: WarmupBuildContext): boolean {
  return (
    hasLimitation(ctx, "knees") ||
    hasLimitation(ctx, "overweight") ||
    ctx.input.weight > 100
  );
}

function isCardioLimited(ctx: WarmupBuildContext): boolean {
  const access = ctx.input.cardioAccess ?? "outdoor";
  return access === "none" || access === "limited";
}

function isRunningDay(dayType: DayType): boolean {
  return dayType === "easy_run" || dayType === "intervals";
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
  if (hasLimitation(ctx, "shoulders")) {
    if (exercise.id === "scapular_pulls" || exercise.id === "dead_hang") {
      return false;
    }
  }
  if (!hasBar(ctx)) {
    if (exercise.id === "scapular_pulls" || exercise.id === "dead_hang") {
      return false;
    }
  }
  if (exercise.id === "dead_hang" || exercise.id === "scapular_pulls") {
    return hasBar(ctx) && !hasLimitation(ctx, "shoulders");
  }
  const needs = exercise.equipment.filter((e) => e !== "none");
  if (needs.length > 0) {
    const ok = needs.some((e) => hasEquipment(ctx, e));
    if (!ok) return false;
  }
  return true;
}

function resolveGeneralLayer(ctx: WarmupBuildContext, blueprint: DayBlueprint): string[] {
  const ids = [...blueprint.general];

  if (isRunningDay(ctx.dayType)) {
    if (isCardioLimited(ctx)) {
      return ["marching"];
    }
    return ids.includes("brisk_walk") ? ["brisk_walk", "marching"] : ["marching"];
  }

  if (isCardioLimited(ctx) || ctx.input.cardioPreference === "dislike") {
    return ["marching"];
  }

  return ids.length > 0 ? ids : ["marching"];
}

function tryResolveExercise(
  ctx: WarmupBuildContext,
  primaryId: string,
  seen: Set<string>
): string | null {
  const candidates = [primaryId, ...(ACTIVATION_FALLBACKS[primaryId] ?? [])];
  for (const id of candidates) {
    if (seen.has(id) || !ALLOWED_WARMUP_EXERCISE_IDS.has(id)) continue;
    const ex = getExercise(id);
    if (!ex || !canUseWarmupExercise(ctx, ex)) continue;
    return id;
  }
  return null;
}

function extraJointForLevel(ctx: WarmupBuildContext): string | null {
  const rank = LEVEL_RANK[ctx.result.overallLevel];
  if (rank < LEVEL_RANK.intermediate) return null;

  const upperDays: DayType[] = ["pull", "push", "full_body"];
  const lowerDays: DayType[] = ["legs", "easy_run", "intervals", "full_body"];

  if (upperDays.includes(ctx.dayType)) {
    return tryResolveExercise(ctx, "elbow_rotations", new Set());
  }
  if (lowerDays.includes(ctx.dayType)) {
    return tryResolveExercise(ctx, "knee_rotations", new Set());
  }
  return null;
}

function toWarmupGenerated(
  exerciseId: string,
  reducedGeneral: boolean
): GeneratedExercise {
  const ex = getExercise(exerciseId);
  const layer = EXERCISE_LAYER[exerciseId];
  const isReducedGeneral =
    reducedGeneral && layer === "general" && exerciseId === "marching";

  let prescription = WARMUP_PRESCRIPTIONS[exerciseId] ?? {
    en: "30 sec",
    ru: "30 сек",
  };
  if (isReducedGeneral) {
    prescription = { en: "45 sec", ru: "45 сек" };
  }

  return {
    exerciseId,
    name: ex?.name ?? { en: exerciseId, ru: exerciseId },
    prescription,
    restSeconds: 0,
  };
}

function durationForItem(exerciseId: string, reducedGeneral: boolean): number {
  if (reducedGeneral && exerciseId === "marching") {
    return REDUCED_GENERAL_SECONDS;
  }
  return WARMUP_DURATION_SECONDS[exerciseId] ?? 30;
}

export function buildWarmupExercises(ctx: WarmupBuildContext): GeneratedExercise[] {
  const blueprint = DAY_BLUEPRINTS[ctx.dayType];
  const reducedGeneral =
    isCardioLimited(ctx) ||
    ctx.input.cardioPreference === "dislike" ||
    (!isRunningDay(ctx.dayType) && isCardioLimited(ctx));

  const ordered: string[] = [];
  const seen = new Set<string>();
  const layersPresent = new Set<WarmupLayer>();

  const addResolved = (id: string) => {
    const resolved = tryResolveExercise(ctx, id, seen);
    if (!resolved) return;
    seen.add(resolved);
    ordered.push(resolved);
    const layer = EXERCISE_LAYER[resolved];
    if (layer) layersPresent.add(layer);
  };

  for (const id of resolveGeneralLayer(ctx, blueprint)) {
    addResolved(id);
  }

  for (const id of blueprint.joints) {
    addResolved(id);
  }

  for (const id of blueprint.activation) {
    addResolved(id);
  }

  const layerOrder: WarmupLayer[] = ["general", "joints", "activation"];
  for (const layer of layerOrder) {
    if (layersPresent.has(layer)) continue;
    const pool =
      layer === "general"
        ? ["marching", "brisk_walk"]
        : layer === "joints"
          ? ["arm_circles", "shoulder_rolls", "hip_circles", "ankle_rotations"]
          : ["bird_dog", "wall_slides", "dead_bug_light"];
    for (const id of pool) {
      if (layersPresent.has(layer)) break;
      addResolved(id);
    }
  }

  const extraJoint = extraJointForLevel(ctx);
  if (extraJoint && !seen.has(extraJoint)) {
    seen.add(extraJoint);
    ordered.push(extraJoint);
    layersPresent.add("joints");
  }

  return ordered.map((id) => toWarmupGenerated(id, reducedGeneral));
}

export function getWarmupLayersPresent(items: GeneratedExercise[]): WarmupLayer[] {
  const layers = new Set<WarmupLayer>();
  for (const item of items) {
    const layer = getWarmupLayer(item.exerciseId);
    if (layer) layers.add(layer);
  }
  return [...layers];
}

/** Setup and transition time between checklist items (~15–20 sec each). */
const TRANSITION_SECONDS_PER_ITEM = 18;

export function estimateWarmupSeconds(items: GeneratedExercise[]): number {
  const exerciseTime = items.reduce((sum, item) => {
    const reduced =
      item.prescription.en === "45 sec" || item.prescription.ru === "45 сек";
    return sum + durationForItem(item.exerciseId, reduced);
  }, 0);
  return exerciseTime + items.length * TRANSITION_SECONDS_PER_ITEM;
}

export function estimateWarmupMinutes(items: GeneratedExercise[]): number {
  const seconds = estimateWarmupSeconds(items);
  return Math.max(1, Math.ceil(seconds / 60));
}
