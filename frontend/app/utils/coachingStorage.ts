import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type CoachingState = {
  version: 1;
  /** One-time screen after first assessment. */
  startDebriefSeen: boolean;
  /** Program week when reassessment prompt was last dismissed. */
  lastReassessmentPromptDismissWeek: number;
  /** How many times assessment was completed (initial + re-runs). */
  assessmentCompletionCount: number;
};

const DEFAULT: CoachingState = {
  version: 1,
  startDebriefSeen: false,
  lastReassessmentPromptDismissWeek: 0,
  assessmentCompletionCount: 0,
};

export function loadCoachingState(): CoachingState {
  const raw = safeGet<CoachingState | null>(STORAGE_KEYS.coachingState, null);
  if (!raw || raw.version !== 1) return { ...DEFAULT };
  return raw;
}

export function saveCoachingState(state: CoachingState): void {
  safeSet(STORAGE_KEYS.coachingState, state);
}

export function markStartDebriefSeen(): CoachingState {
  const state = { ...loadCoachingState(), startDebriefSeen: true };
  saveCoachingState(state);
  return state;
}

export function recordAssessmentCompletion(): CoachingState {
  const prev = loadCoachingState();
  const state: CoachingState = {
    ...prev,
    assessmentCompletionCount: prev.assessmentCompletionCount + 1,
  };
  saveCoachingState(state);
  return state;
}

export function dismissReassessmentPrompt(programWeek: number): CoachingState {
  const state = {
    ...loadCoachingState(),
    lastReassessmentPromptDismissWeek: programWeek,
  };
  saveCoachingState(state);
  return state;
}
