import type { GeneratedExercise, GeneratedWorkout } from "../data/workoutGeneratorV2";
import { exerciseItemKey } from "./activeTrainingSession";

export { exerciseItemKey };

/** Main session items in generator order (main → accessory → conditioning). */
export function getWorkoutMainItems(workout: GeneratedWorkout): GeneratedExercise[] {
  const items = [
    ...workout.blocks.mainWork.items,
    ...workout.blocks.accessoryWork.items,
  ];
  if (workout.blocks.conditioning?.items.length) {
    items.push(...workout.blocks.conditioning.items);
  }
  return items;
}

export function countSessionExercises(workout: GeneratedWorkout): number {
  return workout.blocks.warmup.items.length + getWorkoutMainItems(workout).length;
}
