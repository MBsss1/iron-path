/** Local calendar date as YYYY-MM-DD (not UTC). */
export function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Add calendar days to a local date key (no UTC). */
export function addLocalDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

export function getTomorrowLocalDateKey(todayKey = getLocalDateKey()): string {
  return addLocalDays(todayKey, 1);
}

export function isLocalDateKeyBefore(a: string, b: string): boolean {
  return a < b;
}

/** Display date for locker UI (e.g. "June 6" / "6 июня"). */
export function formatLocalDateKey(
  dateKey: string,
  locale: "en" | "ru"
): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
  });
}

/** Inclusive calendar days between two local date keys. */
export function daysBetweenLocalDateKeys(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}
