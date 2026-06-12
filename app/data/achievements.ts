export type AchievementId =
  | "first_workout"
  | "level_5"
  | "level_10"
  | "level_25"
  | "week_4"
  | "week_12"
  | "week_24"
  | "iron_legend"
  | "first_season"
  | "xp_1000"
  | "xp_5000"
  | "streak_7"
  | "streak_30"
  | "workouts_100";

export type AchievementCategory =
  | "training"
  | "progress"
  | "streak"
  | "legacy"
  | "milestone";

export type AchievementKind =
  | "workout"
  | "level"
  | "week"
  | "xp"
  | "legacy"
  | "streak"
  | "season";

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  hint: string;
  category: AchievementCategory;
  kind: AchievementKind;
  threshold: number;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_workout",
    title: "First Workout",
    description: "Complete your first training workout.",
    hint: "Finish one workout on the Training screen.",
    category: "training",
    kind: "workout",
    threshold: 1,
  },
  {
    id: "workouts_100",
    title: "100 Workouts",
    description: "Complete 100 training workouts.",
    hint: "Keep showing up on Training day after day.",
    category: "training",
    kind: "workout",
    threshold: 100,
  },
  {
    id: "level_5",
    title: "Level 5",
    description: "Reach level 5.",
    hint: "Earn XP from workouts, missions, and daily rewards.",
    category: "progress",
    kind: "level",
    threshold: 5,
  },
  {
    id: "level_10",
    title: "Level 10",
    description: "Reach level 10.",
    hint: "Stay consistent to rank up faster.",
    category: "progress",
    kind: "level",
    threshold: 10,
  },
  {
    id: "level_25",
    title: "Level 25",
    description: "Reach level 25.",
    hint: "Only the disciplined reach this rank.",
    category: "progress",
    kind: "level",
    threshold: 25,
  },
  {
    id: "week_4",
    title: "Week 4",
    description: "Complete your fourth week.",
    hint: "Use Complete Week on the Training screen.",
    category: "progress",
    kind: "week",
    threshold: 4,
  },
  {
    id: "week_12",
    title: "Week 12",
    description: "Complete your twelfth week.",
    hint: "Halfway through the season path.",
    category: "progress",
    kind: "week",
    threshold: 12,
  },
  {
    id: "week_24",
    title: "Week 24",
    description: "Complete your twenty-fourth week.",
    hint: "Finish the full 24-week season.",
    category: "progress",
    kind: "week",
    threshold: 24,
  },
  {
    id: "xp_1000",
    title: "1000 XP",
    description: "Earn 1,000 total experience points.",
    hint: "Every mission and workout adds up.",
    category: "milestone",
    kind: "xp",
    threshold: 1000,
  },
  {
    id: "xp_5000",
    title: "5000 XP",
    description: "Earn 5,000 total experience points.",
    hint: "Long-term dedication unlocks this milestone.",
    category: "milestone",
    kind: "xp",
    threshold: 5000,
  },
  {
    id: "streak_7",
    title: "7 Day Streak",
    description: "Log in and claim daily rewards for 7 days straight.",
    hint: "Claim your daily login reward every day.",
    category: "streak",
    kind: "streak",
    threshold: 7,
  },
  {
    id: "streak_30",
    title: "30 Day Streak",
    description: "Log in and claim daily rewards for 30 days straight.",
    hint: "Never miss a day on the Iron Path.",
    category: "streak",
    kind: "streak",
    threshold: 30,
  },
  {
    id: "first_season",
    title: "First Season",
    description: "Complete your first 24-week season.",
    hint: "Reach week 24 and finish the season.",
    category: "legacy",
    kind: "season",
    threshold: 1,
  },
  {
    id: "iron_legend",
    title: "Iron Legend",
    description: "Complete Season 1 and earn the Iron Legend legacy badge.",
    hint: "Claim the season completion reward at week 24.",
    category: "legacy",
    kind: "legacy",
    threshold: 1,
  },
];

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  "training",
  "progress",
  "streak",
  "legacy",
  "milestone",
];

export function getAchievementDefinition(id: AchievementId) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id) ?? null;
}

export function getAchievementsByCategory(category: AchievementCategory) {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category);
}
