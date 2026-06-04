import type { Profile } from "../hooks/useProfile";
import { getPathModeFromProfile } from "../data/pathMode";
import {
  assessFitness,
  type AssessmentInput,
  type AssessmentResult,
  type FitnessGoal,
} from "../data/fitnessAssessment";
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

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DaySlotStatus = "completed" | "current" | "upcoming";

export type CalendarDay = {
  dayIndex: WeekdayIndex;
  dayType: DayType;
  status: DaySlotStatus;
  isTrainingDay: boolean;
};

export type TrainingCalendarState = {
  seasonWeek: number;
  completedDayIndexes: number[];
  activeDayIndex: WeekdayIndex;
};

const CALENDAR_KEY = STORAGE_KEYS.trainingCalendar;

const GOALS: FitnessGoal[] = ["mass_gain", "fat_loss", "runner", "athletic"];

function parseGoal(goal: string | undefined): FitnessGoal {
  if (goal && GOALS.includes(goal as FitnessGoal)) {
    return goal as FitnessGoal;
  }
  return "mass_gain";
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

  const input: AssessmentInput = {
    age,
    height,
    weight,
    goal,
    maxPullUps: goal === "runner" ? 2 : 3,
    maxPushUps: 15,
    squatReps2Min: 45,
    plankSeconds: 60,
    walkRun12MinMeters: 1600,
    equipment: ["pull_up_bar"],
    limitations: weight >= 100 ? ["overweight"] : ["none"],
    cardioAccess: goal === "runner" ? "outdoor" : weight >= 100 ? "limited" : "limited",
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
    return {
      seasonWeek,
      completedDayIndexes: [],
      activeDayIndex: 0,
    };
  }

  return {
    seasonWeek: stored.seasonWeek,
    completedDayIndexes: [...stored.completedDayIndexes],
    activeDayIndex: clampDayIndex(stored.activeDayIndex),
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
  state: TrainingCalendarState
): CalendarDay[] {
  const active = resolveActiveDayIndex(state.completedDayIndexes);

  return weekPlan.days.map((slot) => {
    const dayIndex = slot.dayIndex as WeekdayIndex;
    let status: DaySlotStatus = "upcoming";

    if (state.completedDayIndexes.includes(dayIndex)) {
      status = "completed";
    } else if (dayIndex === active) {
      status = "current";
    }

    return {
      dayIndex,
      dayType: slot.dayType,
      status,
      isTrainingDay: !isRestDayType(slot.dayType),
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
  return generateWorkout(input, result, slot.dayType, pathMode);
}

export function advanceAfterWorkoutLogged(
  state: TrainingCalendarState
): TrainingCalendarState {
  const active = resolveActiveDayIndex(state.completedDayIndexes);
  const completed = state.completedDayIndexes.includes(active)
    ? state.completedDayIndexes
    : [...state.completedDayIndexes, active].sort((a, b) => a - b);

  const nextActive = resolveActiveDayIndex(completed);

  return {
    ...state,
    completedDayIndexes: completed,
    activeDayIndex: nextActive,
  };
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
