import type { StreakDay } from "../components/StreakCalendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isWithinLoginStreak(
  day: Date,
  lastLoginDate: string | null,
  streak: number
): boolean {
  if (!lastLoginDate || streak < 1) return false;

  const anchor = new Date(lastLoginDate);
  if (Number.isNaN(anchor.getTime())) return false;

  const streakStart = new Date(anchor);
  streakStart.setDate(anchor.getDate() - (streak - 1));

  const dayTime = startOfDay(day).getTime();
  return (
    dayTime >= startOfDay(streakStart).getTime() &&
    dayTime <= startOfDay(anchor).getTime()
  );
}

/** Builds Mon–Sun for the current week; only marks days with stored login-streak data. */
export function buildWeekStreakDays(
  lastLoginDate: string | null,
  loginStreak: number
): StreakDay[] {
  const today = startOfDay(new Date());
  const weekStart = new Date(today);
  const mondayOffset = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - mondayOffset);

  const days: StreakDay[] = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    let status: StreakDay["status"];
    if (date.getTime() > today.getTime()) {
      status = "future";
    } else if (isWithinLoginStreak(date, lastLoginDate, loginStreak)) {
      status = "completed";
    } else {
      status = "neutral";
    }

    days.push({
      day: WEEKDAY_LABELS[date.getDay()],
      date: date.getDate(),
      status,
      isToday: isSameCalendarDay(date, today),
    });
  }

  return days;
}
