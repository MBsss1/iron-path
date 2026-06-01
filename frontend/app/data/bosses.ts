export type BossId =
  | "weakness"
  | "laziness"
  | "distraction"
  | "comfort"
  | "inconsistency"
  | "procrastination"
  | "chaos"
  | "burnout"
  | "self_doubt"
  | "mediocrity"
  | "excuses"
  | "stagnation"
  | "shadow_self";

export type BossTier = 1 | 2 | 3 | 4 | 5;

export type BossRequirementType =
  | "workouts"
  | "dailyMissions"
  | "deepWorkSessions"
  | "streakDays"
  | "totalXp"
  | "allBossesDefeated";

export type BossRequirement = {
  type: BossRequirementType;
  target: number;
  label: string;
};

export type BossRewards = {
  xp: number;
  title: string;
  titleId: string;
  badge: string;
};

export type BossDefinition = {
  id: BossId;
  name: string;
  tier: BossTier;
  description: string;
  difficulty: "Novice" | "Adept" | "Veteran" | "Elite" | "Legendary";
  requiredLevel: number;
  requirement: BossRequirement;
  rewards: BossRewards;
  lore: string;
};

export const BOSS_TIERS: { tier: BossTier; label: string }[] = [
  { tier: 1, label: "Tier I — The Inner Foes" },
  { tier: 2, label: "Tier II — The Comfort Trap" },
  { tier: 3, label: "Tier III — The Breaking Point" },
  { tier: 4, label: "Tier IV — The Plateau Kings" },
  { tier: 5, label: "Tier V — The Final Mirror" },
];

export const BOSSES: BossDefinition[] = [
  {
    id: "weakness",
    name: "Weakness",
    tier: 1,
    description: "The voice that whispers quit when iron gets heavy.",
    difficulty: "Novice",
    requiredLevel: 1,
    requirement: {
      type: "workouts",
      target: 3,
      label: "Complete 3 workouts",
    },
    rewards: { xp: 150, title: "Awakened", titleId: "awakened", badge: "awakened" },
    lore: "Every rep against Weakness forges the will you thought you lacked.",
  },
  {
    id: "laziness",
    name: "Laziness",
    tier: 1,
    description: "A heavy fog that settles when momentum matters most.",
    difficulty: "Novice",
    requiredLevel: 2,
    requirement: {
      type: "dailyMissions",
      target: 5,
      label: "Complete 5 daily missions",
    },
    rewards: { xp: 200, title: "Driven", titleId: "driven", badge: "driven" },
    lore: "Laziness fears the rhythm of small victories stacked day after day.",
  },
  {
    id: "distraction",
    name: "Distraction",
    tier: 1,
    description: "A thousand sirens pulling focus from the path.",
    difficulty: "Novice",
    requiredLevel: 3,
    requirement: {
      type: "deepWorkSessions",
      target: 3,
      label: "Complete 3 deep work sessions",
    },
    rewards: { xp: 250, title: "Focused", titleId: "focused", badge: "focused" },
    lore: "Still the mind. One session at a time, Distraction loses its grip.",
  },
  {
    id: "comfort",
    name: "Comfort",
    tier: 2,
    description: "The warm cage that feels like rest but steals growth.",
    difficulty: "Adept",
    requiredLevel: 5,
    requirement: {
      type: "streakDays",
      target: 3,
      label: "Maintain a 3 day login streak",
    },
    rewards: {
      xp: 350,
      title: "Disciplined",
      titleId: "disciplined",
      badge: "disciplined",
    },
    lore: "Comfort breaks when you return to the path without excuse.",
  },
  {
    id: "inconsistency",
    name: "Inconsistency",
    tier: 2,
    description: "The phantom that erases progress between good days.",
    difficulty: "Adept",
    requiredLevel: 7,
    requirement: {
      type: "streakDays",
      target: 7,
      label: "Maintain a 7 day login streak",
    },
    rewards: { xp: 450, title: "Steadfast", titleId: "steadfast", badge: "steadfast" },
    lore: "Seven days of fire. Inconsistency cannot survive the heat.",
  },
  {
    id: "procrastination",
    name: "Procrastination",
    tier: 2,
    description: "Tomorrow's champion who never shows up today.",
    difficulty: "Adept",
    requiredLevel: 8,
    requirement: {
      type: "totalXp",
      target: 1000,
      label: "Earn 1,000 total XP",
    },
    rewards: {
      xp: 500,
      title: "Executor",
      titleId: "executor",
      badge: "executor",
    },
    lore: "A thousand points of proof — action, not intention, wins.",
  },
  {
    id: "chaos",
    name: "Chaos",
    tier: 3,
    description: "Storm and noise that scatter your training into fragments.",
    difficulty: "Veteran",
    requiredLevel: 10,
    requirement: {
      type: "workouts",
      target: 15,
      label: "Complete 15 workouts",
    },
    rewards: { xp: 600, title: "Tempered", titleId: "tempered", badge: "tempered" },
    lore: "Order the body. Chaos retreats when routine becomes law.",
  },
  {
    id: "burnout",
    name: "Burnout",
    tier: 3,
    description: "The hollow king of too much, too fast, too alone.",
    difficulty: "Veteran",
    requiredLevel: 12,
    requirement: {
      type: "dailyMissions",
      target: 20,
      label: "Complete 20 daily missions",
    },
    rewards: { xp: 700, title: "Resilient", titleId: "resilient", badge: "resilient" },
    lore: "Pace the fire. Burnout dies when discipline outlasts intensity.",
  },
  {
    id: "self_doubt",
    name: "Self-Doubt",
    tier: 3,
    description: "The mirror that shows failure before you begin.",
    difficulty: "Veteran",
    requiredLevel: 14,
    requirement: {
      type: "deepWorkSessions",
      target: 10,
      label: "Complete 10 deep work sessions",
    },
    rewards: { xp: 800, title: "Certain", titleId: "certain", badge: "certain" },
    lore: "Ten hours of focus. Doubt cannot argue with evidence.",
  },
  {
    id: "mediocrity",
    name: "Mediocrity",
    tier: 4,
    description: "The tyrant of almost-good-enough.",
    difficulty: "Elite",
    requiredLevel: 16,
    requirement: {
      type: "streakDays",
      target: 14,
      label: "Maintain a 14 day login streak",
    },
    rewards: { xp: 900, title: "Ascendant", titleId: "ascendant", badge: "ascendant" },
    lore: "Fourteen days unbroken. Mediocrity has no seat at your table.",
  },
  {
    id: "excuses",
    name: "Excuses",
    tier: 4,
    description: "A silver tongue that negotiates your standards downward.",
    difficulty: "Elite",
    requiredLevel: 18,
    requirement: {
      type: "totalXp",
      target: 2500,
      label: "Earn 2,500 total XP",
    },
    rewards: {
      xp: 1000,
      title: "Accountable",
      titleId: "accountable",
      badge: "accountable",
    },
    lore: "No story survives two thousand five hundred points of truth.",
  },
  {
    id: "stagnation",
    name: "Stagnation",
    tier: 4,
    description: "The still water that looks peaceful but rots from within.",
    difficulty: "Elite",
    requiredLevel: 20,
    requirement: {
      type: "workouts",
      target: 30,
      label: "Complete 30 workouts",
    },
    rewards: {
      xp: 1100,
      title: "Unstoppable",
      titleId: "unstoppable",
      badge: "unstoppable",
    },
    lore: "Thirty sessions. Stagnation shatters under relentless motion.",
  },
  {
    id: "shadow_self",
    name: "The Shadow Self",
    tier: 5,
    description: "Every weakness you defeated — now wearing your face.",
    difficulty: "Legendary",
    requiredLevel: 25,
    requirement: {
      type: "allBossesDefeated",
      target: 12,
      label: "Defeat all 12 prior bosses",
    },
    rewards: {
      xp: 2000,
      title: "Iron Legend",
      titleId: "iron_legend",
      badge: "iron_legend",
    },
    lore: "The final mirror. Only the forged walk away crowned.",
  },
];

export function getBoss(id: BossId): BossDefinition | undefined {
  return BOSSES.find((b) => b.id === id);
}

export function getBossIndex(id: BossId): number {
  return BOSSES.findIndex((b) => b.id === id);
}

export function getBossesByTier(tier: BossTier): BossDefinition[] {
  return BOSSES.filter((b) => b.tier === tier);
}

export function getTitleLabel(titleId: string | null | undefined): string | null {
  if (!titleId) return null;
  const boss = BOSSES.find((b) => b.rewards.titleId === titleId);
  return boss?.rewards.title ?? null;
}

export function getBadgeLabel(badgeId: string): string {
  return badgeId.replace(/_/g, " ").toUpperCase();
}
