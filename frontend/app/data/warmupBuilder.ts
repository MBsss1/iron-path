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
  "marching",
  "brisk_walk",
  "bird_dog",
  "dead_bug_light",
  "dead_bug",
  "dead_hang",
  "scapular_pulls",
  "wall_slides",
  "leg_swings",
  "elbow_rotations",
  "wrist_rotations",
]);

/**
 * Universal home warmup — fixed order from project doc "разминка".
 * Same checklist for all day types; only contraindications may skip items.
 */
export const UNIVERSAL_WARMUP_SEQUENCE = [
  "head_rotations",
  "shoulder_rolls",
  "arm_circles",
  "torso_rotations",
  "hip_circles",
  "knee_rotations",
  "ankle_rotations",
] as const;

export const ALLOWED_WARMUP_EXERCISE_IDS = new Set<string>(
  UNIVERSAL_WARMUP_SEQUENCE
);

const EXERCISE_LAYER: Record<string, WarmupLayer> = {
  head_rotations: "joints",
  shoulder_rolls: "joints",
  arm_circles: "joints",
  torso_rotations: "joints",
  hip_circles: "joints",
  knee_rotations: "joints",
  ankle_rotations: "joints",
};

const WARMUP_PRESCRIPTIONS: Record<string, LocalizedText> = {
  head_rotations: { en: "5–8 each way", ru: "5–8 раз в каждую сторону" },
  shoulder_rolls: { en: "10 forward, 10 back", ru: "10 вперёд, 10 назад" },
  arm_circles: { en: "10 forward, 10 back", ru: "10 вперёд, 10 назад" },
  torso_rotations: { en: "10 reps", ru: "10 повторений" },
  hip_circles: { en: "10 reps", ru: "10 повторений" },
  knee_rotations: { en: "10 each way", ru: "10 в каждую сторону" },
  ankle_rotations: { en: "10 each foot", ru: "10 на каждую стопу" },
};

const WARMUP_DURATION_SECONDS: Record<string, number> = {
  head_rotations: 45,
  shoulder_rolls: 40,
  arm_circles: 40,
  torso_rotations: 40,
  hip_circles: 35,
  knee_rotations: 35,
  ankle_rotations: 50,
};

export function getWarmupLayer(exerciseId: string): WarmupLayer | null {
  return EXERCISE_LAYER[exerciseId] ?? null;
}

function hasLimitation(ctx: WarmupBuildContext, id: string): boolean {
  return ctx.input.limitations.includes(id);
}

function canUseWarmupExercise(ctx: WarmupBuildContext, exercise: Exercise): boolean {
  if (!ALLOWED_WARMUP_EXERCISE_IDS.has(exercise.id)) return false;
  if (BANNED_WARMUP_EXERCISE_IDS.has(exercise.id)) return false;

  if (exercise.contraindications) {
    for (const c of exercise.contraindications) {
      if (c !== "none" && hasLimitation(ctx, c)) return false;
    }
  }

  return true;
}

function toWarmupGenerated(exerciseId: string): GeneratedExercise {
  const ex = getExercise(exerciseId);
  const prescription = WARMUP_PRESCRIPTIONS[exerciseId] ?? {
    en: "10 reps",
    ru: "10 повторений",
  };

  return {
    exerciseId,
    name: ex?.name ?? { en: exerciseId, ru: exerciseId },
    prescription,
    restSeconds: 0,
  };
}

export function buildWarmupExercises(ctx: WarmupBuildContext): GeneratedExercise[] {
  return UNIVERSAL_WARMUP_SEQUENCE.filter((id) => {
    const exercise = getExercise(id);
    return exercise && canUseWarmupExercise(ctx, exercise);
  }).map((id) => toWarmupGenerated(id));
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
  const exerciseTime = items.reduce(
    (sum, item) => sum + (WARMUP_DURATION_SECONDS[item.exerciseId] ?? 30),
    0
  );
  return exerciseTime + items.length * TRANSITION_SECONDS_PER_ITEM;
}

export function estimateWarmupMinutes(items: GeneratedExercise[]): number {
  const seconds = estimateWarmupSeconds(items);
  return Math.max(1, Math.ceil(seconds / 60));
}
