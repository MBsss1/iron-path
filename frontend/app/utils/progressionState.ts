import type { AssessmentInput } from "../data/fitnessAssessment";
import { countMilestonesReadyForAdvance } from "../data/progressions/stageEngine";
import { TRACK_PROGRESSIONS } from "../data/progressions/stagePools";
import { metricFromInput } from "../data/progressions/types";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type ProgressionState = {
  version: 1;
  /** ISO date when metrics snapshot was taken. */
  snapshotAt: string;
  metrics: Record<string, number>;
  /** Program weeks elapsed without metric change since snapshot. */
  weeksWithoutProgress: number;
  /** Last program week we rolled the counter. */
  lastCheckedProgramWeek: number;
};

const DEFAULT: ProgressionState = {
  version: 1,
  snapshotAt: new Date().toISOString(),
  metrics: {},
  weeksWithoutProgress: 0,
  lastCheckedProgramWeek: 0,
};

function metricsFromInput(input: AssessmentInput): Record<string, number> {
  const metrics: Record<string, number> = {};
  for (const track of TRACK_PROGRESSIONS) {
    metrics[track.id] = metricFromInput(input, track.id);
  }
  return metrics;
}

export function loadProgressionState(): ProgressionState {
  const raw = safeGet<ProgressionState | null>(STORAGE_KEYS.progressionState, null);
  if (!raw || raw.version !== 1) return { ...DEFAULT };
  return raw;
}

export function saveProgressionState(state: ProgressionState): void {
  safeSet(STORAGE_KEYS.progressionState, state);
}

export function resetProgressionState(input: AssessmentInput): ProgressionState {
  const state: ProgressionState = {
    version: 1,
    snapshotAt: new Date().toISOString(),
    metrics: metricsFromInput(input),
    weeksWithoutProgress: 0,
    lastCheckedProgramWeek: 0,
  };
  saveProgressionState(state);
  return state;
}

function metricsEqual(
  a: Record<string, number>,
  b: Record<string, number>
): boolean {
  for (const track of TRACK_PROGRESSIONS) {
    if ((a[track.id] ?? 0) !== (b[track.id] ?? 0)) return false;
  }
  return true;
}

/** Call when program week advances — increments stuck counter if metrics unchanged. */
export function tickProgressionWeek(
  input: AssessmentInput,
  programWeek: number
): ProgressionState {
  const prev = loadProgressionState();
  const current = metricsFromInput(input);

  if (programWeek <= prev.lastCheckedProgramWeek) {
    return prev;
  }

  const unchanged = metricsEqual(prev.metrics, current);
  const state: ProgressionState = {
    ...prev,
    weeksWithoutProgress: unchanged ? prev.weeksWithoutProgress + 1 : 0,
    lastCheckedProgramWeek: programWeek,
    ...(unchanged ? {} : { metrics: current, snapshotAt: new Date().toISOString() }),
  };
  saveProgressionState(state);
  return state;
}

export function countEarlyMilestonesFromReassessment(
  previous: AssessmentInput,
  next: AssessmentInput
): number {
  return countMilestonesReadyForAdvance(previous, next);
}

export function isStuckOnStages(state: ProgressionState): boolean {
  return state.weeksWithoutProgress >= 3;
}

/** Read-only estimate — does not persist. */
export function estimateWeeksWithoutProgress(
  input: AssessmentInput,
  programWeek: number
): number {
  const state = loadProgressionState();
  const current = metricsFromInput(input);
  if (!metricsEqual(state.metrics, current)) return 0;
  const weekDelta = Math.max(0, programWeek - state.lastCheckedProgramWeek);
  return state.weeksWithoutProgress + weekDelta;
}
