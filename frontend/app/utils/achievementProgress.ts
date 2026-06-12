import type { AchievementDefinition } from "../data/achievements";

export type AchievementProgressInput = {
  level: number;
  week: number;
  totalXp: number;
  workoutCount: number;
  loginStreak: number;
  seasonsCompleted: number;
};

export function getAchievementProgress(
  achievement: AchievementDefinition,
  stats: AchievementProgressInput
): { current: number; target: number; percent: number } {
  let current = 0;
  const target = achievement.threshold;

  switch (achievement.kind) {
    case "workout":
      current = stats.workoutCount;
      break;
    case "level":
      current = stats.level;
      break;
    case "week":
      current = stats.week;
      break;
    case "xp":
      current = stats.totalXp;
      break;
    case "streak":
      current = stats.loginStreak;
      break;
    case "season":
      current = stats.seasonsCompleted;
      break;
    case "legacy":
      current = stats.seasonsCompleted > 0 ? 1 : 0;
      break;
    default:
      current = 0;
  }

  const percent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return { current, target, percent };
}

export function formatCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
