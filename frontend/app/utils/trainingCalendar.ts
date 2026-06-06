import type { Profile } from "../hooks/useProfile";
import { getPathModeFromProfile } from "../data/pathMode";
import {
  assessFitness,
  type AssessmentInput,
  type AssessmentResult,
} from "../data/fitnessAssessment";
import {
  normalizeFitnessGoal,
  parseProfileGoal,
  type FitnessGoal,
} from "../data/fitnessGoals";
import {
  generateWeekPlan,
  generateWorkout,
  type DayType,
  type GeneratedWorkout,
  type WeekPlan,
} from "../data/workoutGeneratorV2";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";
import { loadFitnessAssessment } from "./fitnessAssessmentStorage";
import { getLocalDateKey, getTomorrowLocalDateKey, addLocalDays } from "./localDate";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DaySlotStatus = "completed" | "current" | "upcoming" | "locked";

export type CalendarDay = {
  dayIndex: WeekdayIndex;
  dayType: DayType;
  status: DaySlotStatus;
  isTrainingDay: boolean;
  unlockedDateKey: string;
  isLocked: boolean;
  isAvailableToday: boolean;
};

export type TrainingCalendarState = {
  seasonWeek: number;
  completedDayIndexes: number[];
  activeDayIndex: WeekdayIndex;
  /** Local YYYY-MM-DD when the current program week started. */
  weekStartedDateKey?: string;
  /** Slot index (0–6) → local YYYY-MM-DD when the slot opens. */
  slotUnlocks?: Record<string, string>;
};

const CALENDAR_KEY = STORAGE_KEYS.trainingCalendar;

function parseGoal(goal: string | undefined): FitnessGoal {
  return parseProfileGoal(goal);
}

/** Conservative defaults until Fitness Assessment UI ships. */
export function profileToAssessment(profile: Profile | null): {
  input: AssessmentInput;
  result: AssessmentResult;
} {
  const age = Math.min(100, Math.max(13, parseInt(profile?.age ?? "25", 10) || 25));
  const height = Math.min(250, Math.max(100, parseInt(profile?.height ?? "175", 10) || 175));
  const weight = Math.min(250, Math.max(30, parseInt(profile?.weight ?? "75", 10) || 75));
  const goal = parseGoal(profile?.goal);
  const normalized = normalizeFitnessGoal(goal);

  const input: AssessmentInput = {
    age,
    height,
    weight,
    goal,
    maxPullUps: normalized === "running" ? 2 : 3,
    maxPushUps: 15,
    squatReps2Min: 45,
    plankSeconds: 60,
    walkRun12MinMeters: 1600,
    equipment: ["pull_up_bar"],
    limitations: weight >= 100 ? ["overweight"] : ["none"],
    cardioAccess:
      normalized === "running" ? "outdoor" : weight >= 100 ? "limited" : "limited",
    cardioPreference: "neutral",
  };

  return { input, result: assessFitness(input) };
}

export function buildWeekPlanForProfile(profile: Profile | null): WeekPlan {
  const pathMode = getPathModeFromProfile(profile) ?? "balance";
  const stored = loadFitnessAssessment();
  if (stored?.input && stored?.result) {
    return generateWeekPlan(stored.input, stored.result, pathMode);
  }
  const { input, result } = profileToAssessment(profile);
  return generateWeekPlan(input, result, pathMode);
}

export function getAssessmentForProfile(profile: Profile | null): {
  input: AssessmentInput;
  result: AssessmentResult;
} {
  const stored = loadFitnessAssessment();
  if (stored?.input && stored?.result) {
    return { input: stored.input, result: stored.result };
  }
  return profileToAssessment(profile);
}

export function isRestDayType(dayType: DayType): boolean {
  return dayType === "mobility";
}

export function loadTrainingCalendarState(seasonWeek: number): TrainingCalendarState {
  const stored = safeGet<TrainingCalendarState | null>(CALENDAR_KEY, null);

  if (!stored || stored.seasonWeek !== seasonWeek) {
    return resetCalendarForNewWeek(seasonWeek);
  }

  return normalizeCalendarState({
    seasonWeek: stored.seasonWeek,
    completedDayIndexes: [...stored.completedDayIndexes],
    activeDayIndex: clampDayIndex(stored.activeDayIndex),
    weekStartedDateKey: stored.weekStartedDateKey,
    slotUnlocks: stored.slotUnlocks,
  });
}

export function resetCalendarForNewWeek(seasonWeek: number): TrainingCalendarState {
  const today = getLocalDateKey();
  return normalizeCalendarState({
    seasonWeek,
    completedDayIndexes: [],
    activeDayIndex: 0,
    weekStartedDateKey: today,
    slotUnlocks: buildDefaultSlotUnlocks([], today),
  });
}

/** Default unlock schedule: first open slot today; after any completion, next slots +1 day each. */
export function buildDefaultSlotUnlocks(
  completedDayIndexes: number[],
  todayKey = getLocalDateKey()
): Record<string, string> {
  const unlocks: Record<string, string> = {};
  let queueOffset = completedDayIndexes.length > 0 ? 1 : 0;

  for (let i = 0; i < 7; i++) {
    if (completedDayIndexes.includes(i)) {
      unlocks[String(i)] = todayKey;
      continue;
    }
    unlocks[String(i)] = addLocalDays(todayKey, queueOffset);
    queueOffset += 1;
  }

  return unlocks;
}

export function resolveSlotUnlocks(
  state: TrainingCalendarState,
  todayKey = getLocalDateKey()
): Record<string, string> {
  const defaults = buildDefaultSlotUnlocks(state.completedDayIndexes, todayKey);
  if (!state.slotUnlocks || Object.keys(state.slotUnlocks).length === 0) {
    return defaults;
  }

  const merged: Record<string, string> = { ...defaults };
  for (const [key, value] of Object.entries(state.slotUnlocks)) {
    if (value) merged[key] = value;
  }
  return merged;
}

export function isSlotUnlocked(
  state: TrainingCalendarState,
  dayIndex: number,
  todayKey = getLocalDateKey()
): boolean {
  if (state.completedDayIndexes.includes(dayIndex)) return true;
  const unlocks = resolveSlotUnlocks(state, todayKey);
  const unlockDate = unlocks[String(dayIndex)] ?? todayKey;
  return todayKey >= unlockDate;
}

export function isActiveSlotLocked(
  state: TrainingCalendarState,
  todayKey = getLocalDateKey()
): boolean {
  const active = resolveActiveDayIndex(state.completedDayIndexes);
  if (state.completedDayIndexes.includes(active)) return false;
  return !isSlotUnlocked(state, active, todayKey);
}

export function getActiveSlotUnlockDateKey(
  state: TrainingCalendarState,
  todayKey = getLocalDateKey()
): string {
  const active = resolveActiveDayIndex(state.completedDayIndexes);
  const unlocks = resolveSlotUnlocks(state, todayKey);
  return unlocks[String(active)] ?? todayKey;
}

function normalizeCalendarState(state: TrainingCalendarState): TrainingCalendarState {
  const activeDayIndex = clampDayIndex(
    resolveActiveDayIndex(state.completedDayIndexes)
  );
  const slotUnlocks = resolveSlotUnlocks(state);
  return {
    ...state,
    activeDayIndex,
    slotUnlocks,
    weekStartedDateKey: state.weekStartedDateKey ?? getLocalDateKey(),
  };
}

export function saveTrainingCalendarState(state: TrainingCalendarState): void {
  safeSet(CALENDAR_KEY, state);
}

function clampDayIndex(index: number): WeekdayIndex {
  return Math.max(0, Math.min(6, index)) as WeekdayIndex;
}

export function resolveActiveDayIndex(
  completedDayIndexes: number[]
): WeekdayIndex {
  for (let i = 0; i < 7; i++) {
    if (!completedDayIndexes.includes(i)) {
      return i as WeekdayIndex;
    }
  }
  return 6;
}

export function buildCalendarDays(
  weekPlan: WeekPlan,
  state: TrainingCalendarState,
  todayKey = getLocalDateKey()
): CalendarDay[] {
  const active = resolveActiveDayIndex(state.completedDayIndexes);
  const unlocks = resolveSlotUnlocks(state, todayKey);

  return weekPlan.days.map((slot) => {
    const dayIndex = slot.dayIndex as WeekdayIndex;
    const unlockedDateKey = unlocks[String(dayIndex)] ?? todayKey;
    const isCompleted = state.completedDayIndexes.includes(dayIndex);
    const isLocked = !isCompleted && todayKey < unlockedDateKey;

    let status: DaySlotStatus = "upcoming";
    if (isCompleted) {
      status = "completed";
    } else if (dayIndex === active) {
      status = isLocked ? "locked" : "current";
    } else if (isLocked) {
      status = "locked";
    }

    return {
      dayIndex,
      dayType: slot.dayType,
      status,
      isTrainingDay: !isRestDayType(slot.dayType),
      unlockedDateKey,
      isLocked,
      isAvailableToday: dayIndex === active && !isLocked && !isCompleted,
    };
  });
}

export function getTodayWorkout(
  profile: Profile | null,
  weekPlan: WeekPlan,
  activeDayIndex: WeekdayIndex
): GeneratedWorkout {
  const { input, result } = getAssessmentForProfile(profile);
  const slot = weekPlan.days[activeDayIndex];
  const pathMode = getPathModeFromProfile(profile) ?? "balance";
  return generateWorkout(input, result, slot.dayType, pathMode, activeDayIndex);
}

export function advanceAfterWorkoutLogged(
  state: TrainingCalendarState,
  options?: { skipIfAlreadyLoggedToday?: boolean }
): TrainingCalendarState {
  if (options?.skipIfAlreadyLoggedToday) {
    return state;
  }

  const active = resolveActiveDayIndex(state.completedDayIndexes);
  const wasAlreadyCompleted = state.completedDayIndexes.includes(active);
  const completed = wasAlreadyCompleted
    ? state.completedDayIndexes
    : [...state.completedDayIndexes, active].sort((a, b) => a - b);

  const nextActive = resolveActiveDayIndex(completed);
  const slotUnlocks = { ...resolveSlotUnlocks(state) };
  slotUnlocks[String(active)] = slotUnlocks[String(active)] ?? getLocalDateKey();

  if (!wasAlreadyCompleted) {
    slotUnlocks[String(nextActive)] = getTomorrowLocalDateKey();
  }

  return normalizeCalendarState({
    ...state,
    completedDayIndexes: completed,
    activeDayIndex: nextActive,
    slotUnlocks,
  });
}

export function syncCalendarIfWorkoutMissionDone(
  state: TrainingCalendarState,
  workoutMissionCompleted: boolean
): TrainingCalendarState {
  if (!workoutMissionCompleted) return state;

  const active = resolveActiveDayIndex(state.completedDayIndexes);
  if (state.completedDayIndexes.includes(active)) {
    return {
      ...state,
      activeDayIndex: resolveActiveDayIndex(state.completedDayIndexes),
    };
  }

  return advanceAfterWorkoutLogged(state);
}
