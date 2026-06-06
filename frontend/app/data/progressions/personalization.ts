import {
  shouldAvoidRunning,
  type AssessmentInput,
  type Limitation,
} from "../fitnessAssessment";
import type { ActiveFitnessGoal } from "../fitnessGoals";
import { getExercise, type Exercise } from "../exercises";
import type { StageExerciseSlot } from "./types";
import { shouldDeEmphasizePull } from "./goalPriorities";

export type PersonalizationContext = {
  input: AssessmentInput;
  goal: ActiveFitnessGoal;
};

function hasLimitation(ctx: PersonalizationContext, id: Limitation): boolean {
  return ctx.input.limitations.includes(id);
}

function hasEquipment(
  ctx: PersonalizationContext,
  eq: import("../exercises").Equipment
): boolean {
  return ctx.input.equipment.includes(eq);
}

export function canUseStageExercise(
  ctx: PersonalizationContext,
  slot: StageExerciseSlot
): boolean {
  const exercise = getExercise(slot.exerciseId);
  if (!exercise) return false;

  if (!hasEquipment(ctx, "pull_up_bar")) {
    const needsBar = [
      "dead_hang",
      "scapular_pullups",
      "negative_pullups",
      "assisted_pullups",
      "pullups",
      "chinups",
      "hanging_knee_raises",
    ];
    if (needsBar.includes(slot.exerciseId)) return false;
  }

  if (!hasEquipment(ctx, "parallel_bars") && slot.exerciseId === "dips") {
    return false;
  }

  if (hasLimitation(ctx, "knees")) {
    if (["lunges", "split_squats", "bulgarian_split_squats", "jumping_jacks", "burpees"].includes(slot.exerciseId)) {
      return false;
    }
  }

  if (hasLimitation(ctx, "back")) {
    if (["hanging_knee_raises", "leg_raises", "backpack_rows"].includes(slot.exerciseId)) {
      return false;
    }
  }

  if (hasLimitation(ctx, "shoulders")) {
    if (["dips", "pike_pushups", "negative_pullups"].includes(slot.exerciseId)) {
      return false;
    }
  }

  if (
    hasLimitation(ctx, "overweight") ||
    ctx.input.weight >= 100
  ) {
    if (["negative_pullups", "burpees", "jumping_jacks"].includes(slot.exerciseId)) {
      return false;
    }
  }

  if (
    shouldAvoidRunning(ctx.input.cardioAccess, ctx.input.cardioPreference) &&
    ["easy_run", "intervals", "light_jog"].includes(slot.exerciseId)
  ) {
    return false;
  }

  if (shouldDeEmphasizePull(ctx.goal, ctx.input.weight)) {
    if (["negative_pullups", "pullups", "chinups"].includes(slot.exerciseId)) {
      return slot.exerciseId === "australian_rows" ? true : false;
    }
  }

  if (ctx.input.maxPullUps <= 2 && slot.exerciseId === "pullups") {
    const p = slot.prescription.en;
    if (!/(5|4|3)\s*×\s*1|max−1|max-1/i.test(p)) return false;
  }

  if (ctx.input.maxPullUps <= 0 && ["pullups", "chinups", "negative_pullups"].includes(slot.exerciseId)) {
    return false;
  }

  if (exercise.contraindications) {
    for (const c of exercise.contraindications) {
      if (c !== "none" && hasLimitation(ctx, c as Limitation)) return false;
    }
  }

  return true;
}

export function adjustPrescriptionForProfile(
  ctx: PersonalizationContext,
  slot: StageExerciseSlot
): StageExerciseSlot {
  let prescription = { ...slot.prescription };

  if (ctx.input.weight >= 110 && slot.exerciseId === "pullups") {
    prescription = {
      en: prescription.en.replace(/5 ×/, "4 ×").replace(/6 ×/, "5 ×"),
      ru: prescription.ru.replace(/5 ×/, "4 ×").replace(/6 ×/, "5 ×"),
    };
  }

  if (ctx.input.age >= 50) {
    prescription = {
      en: `${prescription.en} (controlled tempo)`,
      ru: `${prescription.ru} (контроль темпа)`,
    };
  }

  if (ctx.input.weight >= 100 && slot.exerciseId === "bodyweight_squats") {
    prescription = {
      en: prescription.en.replace(/5 ×/, "4 ×"),
      ru: prescription.ru.replace(/5 ×/, "4 ×"),
    };
  }

  return { ...slot, prescription };
}

export function filterAndPersonalizePool(
  ctx: PersonalizationContext,
  pool: StageExerciseSlot[]
): StageExerciseSlot[] {
  return pool
    .filter((slot) => canUseStageExercise(ctx, slot))
    .map((slot) => adjustPrescriptionForProfile(ctx, slot));
}
