export const STORAGE_KEYS = {
  player: "iron-path-player",
  profile: "iron-path-profile",
  achievements: "iron-path-achievements",
  dailyRewards: "iron-path-daily-rewards",
  dailyMissions: "iron-path-daily-missions",
  bossTrials: "iron-path-boss-trials",
  seasons: "iron-path-seasons",
  strength: "iron-path-strength",
  weightProgress: "iron-path-weight-progress",
  stats: "iron-path-stats",
} as const;

export function clearAllGameData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}
