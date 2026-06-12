import type { ActiveFitnessGoal } from "../fitnessGoals";
import type { DayType } from "../workoutGeneratorV2";
import type { ProgressionTrackId } from "./types";

const GOAL_TRACK_ORDER: Record<ActiveFitnessGoal, ProgressionTrackId[]> = {
  mass_gain: ["pullups", "pushups", "squats", "plank", "running"],
  weight_loss: ["running", "squats", "plank", "pushups", "pullups"],
  running: ["running", "plank", "squats", "pushups", "pullups"],
};

const DAY_TRACK_FOCUS: Partial<
  Record<DayType, ProgressionTrackId[]>
> = {
  pull: ["pullups", "plank"],
  push: ["pushups", "plank"],
  legs: ["squats", "plank"],
  full_body: ["pullups", "pushups", "squats", "plank"],
  easy_run: ["running", "squats", "plank"],
  intervals: ["running", "plank"],
  mobility: ["plank"],
};

export function getGoalTrackOrder(goal: ActiveFitnessGoal): ProgressionTrackId[] {
  return GOAL_TRACK_ORDER[goal] ?? GOAL_TRACK_ORDER.mass_gain;
}

export function getFocusTracksForDay(
  goal: ActiveFitnessGoal,
  dayType: DayType
): ProgressionTrackId[] {
  const dayFocus = DAY_TRACK_FOCUS[dayType];
  if (!dayFocus) return getGoalTrackOrder(goal).slice(0, 3);

  const ordered = getGoalTrackOrder(goal);
  return dayFocus.sort(
    (a, b) => ordered.indexOf(a) - ordered.indexOf(b)
  );
}

export function shouldDeEmphasizePull(
  goal: ActiveFitnessGoal,
  weight: number
): boolean {
  return goal === "weight_loss" && weight >= 100;
}
