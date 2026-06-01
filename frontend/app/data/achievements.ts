export type AchievementId =
  | "first_workout"
  | "level_5"
  | "level_10"
  | "week_4"
  | "week_12"
  | "week_24"
  | "iron_legend"
  | "xp_1000"
  | "xp_5000";

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  kind: "workout" | "level" | "week" | "xp" | "legacy";
  threshold: number;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_workout",
    title: "First Workout",
    description: "Complete your first training workout.",
    kind: "workout",
    threshold: 1,
  },
  {
    id: "level_5",
    title: "Level 5",
    description: "Reach level 5.",
    kind: "level",
    threshold: 5,
  },
  {
    id: "level_10",
    title: "Level 10",
    description: "Reach level 10.",
    kind: "level",
    threshold: 10,
  },
  {
    id: "week_4",
    title: "Week 4",
    description: "Complete your fourth week.",
    kind: "week",
    threshold: 4,
  },
  {
    id: "week_12",
    title: "Week 12",
    description: "Complete your twelfth week.",
    kind: "week",
    threshold: 12,
  },
  {
    id: "week_24",
    title: "Week 24",
    description: "Complete your twenty-fourth week.",
    kind: "week",
    threshold: 24,
  },
  {
    id: "iron_legend",
    title: "Iron Legend",
    description: "Complete Season 1 and earn the Iron Legend legacy badge.",
    kind: "legacy",
    threshold: 1,
  },
  {
    id: "xp_1000",
    title: "1000 XP",
    description: "Earn 1,000 total experience points.",
    kind: "xp",
    threshold: 1000,
  },
  {
    id: "xp_5000",
    title: "5000 XP",
    description: "Earn 5,000 total experience points.",
    kind: "xp",
    threshold: 5000,
  },
];

export function getAchievementDefinition(id: AchievementId) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id) ?? null;
}
