export const STORAGE_KEYS = {
  player: "iron-path-player",
  profile: "iron-path-profile",
  achievements: "iron-path-achievements",
  dailyRewards: "iron-path-daily-rewards",
  dailyMissions: "iron-path-daily-missions",
  nutritionMissions: "iron-path-nutrition-missions",
  bossTrials: "iron-path-boss-trials",
  bossV2: "iron-path-boss-v2",
  seasons: "iron-path-seasons",
  strength: "iron-path-strength",
  weightProgress: "iron-path-weight-progress",
  stats: "iron-path-stats",
  trainingCalendar: "iron-path-training-calendar",
} as const;

export function clearAllGameData(): void {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
