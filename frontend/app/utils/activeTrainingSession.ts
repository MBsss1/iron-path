import type { GeneratedExercise } from "../data/workoutGeneratorV2";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type TrainingStage = "warmup" | "workout";

export type RestTimerSessionState = {
  exerciseKey: string;
  exerciseName: string;
  durationSeconds: number;
  elapsedSeconds: number;
  startedAt: number | null;
  isRunning: boolean;
  isFinished: boolean;
};

export type ActiveTrainingSession = {
  date: string;
  week: number;
  dayIndex: number;
  workoutId: string;
  activeStage: TrainingStage;
  completedWarmupExerciseIds: string[];
  completedWorkoutExerciseIds: string[];
  workoutTimerElapsedSeconds: number;
  workoutTimerStartedAt: number | null;
  workoutTimerIsRunning: boolean;
  restTimerState: RestTimerSessionState | null;
};

export type SessionScope = {
  date: string;
  week: number;
  dayIndex: number;
  workoutId: string;
};

export function exerciseItemKey(item: GeneratedExercise): string {
  return `${item.exerciseId}|${item.prescription.en}`;
}

export function createEmptySession(scope: SessionScope): ActiveTrainingSession {
  return {
    ...scope,
    activeStage: "warmup",
    completedWarmupExerciseIds: [],
    completedWorkoutExerciseIds: [],
    workoutTimerElapsedSeconds: 0,
    workoutTimerStartedAt: null,
    workoutTimerIsRunning: false,
    restTimerState: null,
  };
}

function scopeMatches(
  session: ActiveTrainingSession,
  scope: SessionScope
): boolean {
  return (
    session.date === scope.date &&
    session.week === scope.week &&
    session.dayIndex === scope.dayIndex &&
    session.workoutId === scope.workoutId
  );
}

export function loadActiveTrainingSession(
  scope: SessionScope
): ActiveTrainingSession {
  const stored = safeGet<ActiveTrainingSession | null>(
    STORAGE_KEYS.activeTrainingSession,
    null
  );
  if (stored && scopeMatches(stored, scope)) {
    return stored;
  }
  const fresh = createEmptySession(scope);
  saveActiveTrainingSession(fresh);
  return fresh;
}

export function saveActiveTrainingSession(session: ActiveTrainingSession): void {
  safeSet(STORAGE_KEYS.activeTrainingSession, session);
}

export function clearActiveTrainingSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.activeTrainingSession);
  } catch {
    // ignore
  }
}

/** Elapsed seconds for display, accounting for a running segment. */
export function getWorkoutTimerDisplaySeconds(session: ActiveTrainingSession): number {
  let total = session.workoutTimerElapsedSeconds;
  if (session.workoutTimerIsRunning && session.workoutTimerStartedAt) {
    total += Math.floor((Date.now() - session.workoutTimerStartedAt) / 1000);
  }
  return Math.max(0, total);
}

export function getRestTimerDisplaySeconds(state: RestTimerSessionState): number {
  const total = state.durationSeconds;
  let elapsed = state.elapsedSeconds;
  if (state.isRunning && state.startedAt) {
    elapsed += Math.floor((Date.now() - state.startedAt) / 1000);
  }
  return Math.max(0, total - elapsed);
}
