import {
  getRunningMetricMinutes,
  resolveCardioTestType,
  type AssessmentInput,
} from "../fitnessAssessment";
import type { ActiveFitnessGoal } from "../fitnessGoals";

export type ProgressionTrackId =
  | "pullups"
  | "pushups"
  | "squats"
  | "plank"
  | "running";

export type StageExerciseSlot = {
  exerciseId: string;
  prescription: { en: string; ru: string };
  restSeconds: number;
  role: "main" | "accessory" | "conditioning";
  weight?: number;
};

export type StageBand = {
  fromRung: number;
  toRung: number;
  pool: StageExerciseSlot[];
};

export type TrackProgression = {
  id: ProgressionTrackId;
  ladder: number[];
  i18nLabel: string;
  i18nUnit: string;
  stages: StageBand[];
};

export type StageSnapshot = {
  trackId: ProgressionTrackId;
  current: number;
  fromRung: number;
  toRung: number | null;
  progressPercent: number;
  i18nLabel: string;
  i18nUnit: string;
};

export type WorkoutFocusContext = {
  input: AssessmentInput;
  goal: ActiveFitnessGoal;
  dayType: import("../workoutGeneratorV2").DayType;
  sessionSeed: number;
};

export function metricFromInput(
  input: AssessmentInput,
  trackId: ProgressionTrackId
): number {
  switch (trackId) {
    case "pullups":
      return input.maxPullUps;
    case "pushups":
      return input.maxPushUps;
    case "squats":
      return input.squatReps2Min;
    case "plank":
      return input.plankSeconds;
    case "running":
      return estimateRunMinutes(input);
  }
}

/** Continuous endurance minutes for the running track ladder. */
export function estimateRunMinutes(input: AssessmentInput): number {
  return getRunningMetricMinutes(input);
}

export function isWalkCardioMode(input: AssessmentInput): boolean {
  return resolveCardioTestType(input) === "walk";
}

export function isSkippedCardioMode(input: AssessmentInput): boolean {
  return resolveCardioTestType(input) === "skipped";
}
