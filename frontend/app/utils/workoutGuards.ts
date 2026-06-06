import type { WeekPlan } from "../data/workoutGeneratorV2";
import { safeGet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";
import { getLocalDateKey, daysBetweenLocalDateKeys } from "./localDate";
import {
  isRestDayType,
  resolveSlotUnlocks,
  type TrainingCalendarState,
} from "./trainingCalendar";

export const MIN_WEEK_WORKOUTS = 3;
export const MIN_DAYS_BEFORE_WEEK_COMPLETE = 5;

type DailyMissionsStore = {
  date: string;
  missions: { id: string; completed: boolean }[];
};

/** Whether today's workout mission is already completed (local calendar day). */
export function isWorkoutLoggedToday(): boolean {
  const todayKey = getLocalDateKey();
  const saved = safeGet<DailyMissionsStore | null>(STORAGE_KEYS.dailyMissions, null);
  if (!saved?.missions) return false;

  if (saved.date === todayKey) {
    return saved.missions.find((m) => m.id === "workout")?.completed ?? false;
  }

  // Legacy: missions stored with Date.toDateString()
  if (saved.date === new Date().toDateString()) {
    return saved.missions.find((m) => m.id === "workout")?.completed ?? false;
  }

  return false;
}

export type WeekCompletionBlockReason =
  | "not_enough_workouts"
  | "too_early"
  | "slots_locked";

export type WeekCompletionStatus = {
  allowed: boolean;
  reason?: WeekCompletionBlockReason;
  completedSlots: number;
  requiredSlots: number;
  daysSinceWeekStart: number;
  requiredDays: number;
};

function hasFutureLockedTrainingSlots(
  state: TrainingCalendarState,
  weekPlan: WeekPlan,
  todayKey = getLocalDateKey()
): boolean {
  const unlocks = resolveSlotUnlocks(state, todayKey);
  for (const slot of weekPlan.days) {
    const idx = slot.dayIndex;
    if (state.completedDayIndexes.includes(idx)) continue;
    if (isRestDayType(slot.dayType)) continue;
    const unlockDate = unlocks[String(idx)] ?? todayKey;
    if (todayKey < unlockDate) return true;
  }
  return false;
}

export function getWeekCompletionStatus(
  state: TrainingCalendarState,
  weekPlan: WeekPlan
): WeekCompletionStatus {
  const todayKey = getLocalDateKey();
  const trainingDayCount = weekPlan.days.filter(
    (d) => !isRestDayType(d.dayType)
  ).length;
  const requiredSlots = Math.min(MIN_WEEK_WORKOUTS, trainingDayCount);
  const completedSlots = state.completedDayIndexes.length;
  const weekStart = state.weekStartedDateKey ?? todayKey;
  const daysSinceWeekStart = daysBetweenLocalDateKeys(
    weekStart,
    todayKey
  );

  if (hasFutureLockedTrainingSlots(state, weekPlan, todayKey)) {
    return {
      allowed: false,
      reason: "slots_locked",
      completedSlots,
      requiredSlots,
      daysSinceWeekStart,
      requiredDays: MIN_DAYS_BEFORE_WEEK_COMPLETE,
    };
  }

  if (completedSlots < requiredSlots) {
    return {
      allowed: false,
      reason: "not_enough_workouts",
      completedSlots,
      requiredSlots,
      daysSinceWeekStart,
      requiredDays: MIN_DAYS_BEFORE_WEEK_COMPLETE,
    };
  }

  if (daysSinceWeekStart < MIN_DAYS_BEFORE_WEEK_COMPLETE) {
    return {
      allowed: false,
      reason: "too_early",
      completedSlots,
      requiredSlots,
      daysSinceWeekStart,
      requiredDays: MIN_DAYS_BEFORE_WEEK_COMPLETE,
    };
  }

  return {
    allowed: true,
    completedSlots,
    requiredSlots,
    daysSinceWeekStart,
    requiredDays: MIN_DAYS_BEFORE_WEEK_COMPLETE,
  };
}

export function canAdvanceProgramWeek(
  state: TrainingCalendarState,
  weekPlan: WeekPlan
): boolean {
  return getWeekCompletionStatus(state, weekPlan).allowed;
}
