import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

/** True when the user has logged at least one workout (persisted flag or player count). */
export function readFirstWorkoutDone(workoutCount: number): boolean {
  if (workoutCount > 0) return true;
  return safeGet<boolean>(STORAGE_KEYS.firstWorkoutDone, false);
}

export function persistFirstWorkoutDone(): void {
  safeSet(STORAGE_KEYS.firstWorkoutDone, true);
}

export function clearFirstWorkoutDone(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.firstWorkoutDone);
  } catch {
    // ignore
  }
}
