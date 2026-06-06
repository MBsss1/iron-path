import type { AssessmentInput } from "./fitnessAssessment";
import type { StageExerciseSlot } from "./progressions/types";

/** Horizontal pull when a pull-up bar (or low bar setup) is available. */
export const HORIZONTAL_PULL_WITH_BAR = "australian_rows";

/** Floor-based horizontal pull / rear delt when no bar is available. */
export const HORIZONTAL_PULL_NO_BAR = "prone_reverse_fly";

export function hasPullUpBarAccess(
  input: Pick<AssessmentInput, "equipment">
): boolean {
  return input.equipment.includes("pull_up_bar");
}

export function isHorizontalPullExerciseId(exerciseId: string): boolean {
  return (
    exerciseId === HORIZONTAL_PULL_WITH_BAR ||
    exerciseId === HORIZONTAL_PULL_NO_BAR
  );
}

export function resolveHorizontalPullExerciseId(
  input: Pick<AssessmentInput, "equipment">
): typeof HORIZONTAL_PULL_WITH_BAR | typeof HORIZONTAL_PULL_NO_BAR {
  return hasPullUpBarAccess(input)
    ? HORIZONTAL_PULL_WITH_BAR
    : HORIZONTAL_PULL_NO_BAR;
}

export function resolveConditionalExerciseId(
  exerciseId: string,
  input: Pick<AssessmentInput, "equipment">
): string {
  if (exerciseId === HORIZONTAL_PULL_WITH_BAR) {
    return resolveHorizontalPullExerciseId(input);
  }
  return exerciseId;
}

export function resolveConditionalStageSlot(
  slot: StageExerciseSlot,
  input: Pick<AssessmentInput, "equipment">
): StageExerciseSlot {
  const exerciseId = resolveConditionalExerciseId(slot.exerciseId, input);
  if (exerciseId === slot.exerciseId) return slot;
  return { ...slot, exerciseId };
}
