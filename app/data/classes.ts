export type ClassId = "warrior" | "scholar" | "operator" | "monk";

export type ClassSkill = {
  id: string;
  name: string;
  description: string;
};

export type SkillPassiveBonus = {
  label: string;
  workoutXpBonus: number;
  deepWorkXpBonus: number;
  missionXpBonus: number;
  allXpBonus: number;
};

export type ClassDefinition = {
  id: ClassId;
  name: string;
  focus: string;
  icon: string;
  description: string;
  bonusSummary: string[];
  workoutXpBonus: number;
  deepWorkXpBonus: number;
  missionXpBonus: number;
  allXpBonus: number;
  levelUpBody: number;
  levelUpMind: number;
  levelUpWork: number;
  skill1Passive: SkillPassiveBonus;
  skills: ClassSkill[];
};

export const CLASSES: ClassDefinition[] = [
  {
    id: "warrior",
    name: "Warrior",
    focus: "Body",
    icon: "⚔",
    description: "Forged through iron and repetition. The Warrior grows by training hard and building physical power.",
    bonusSummary: ["+10% workout XP", "+1 Body on level up"],
    workoutXpBonus: 0.1,
    deepWorkXpBonus: 0,
    missionXpBonus: 0,
    allXpBonus: 0,
    levelUpBody: 1,
    levelUpMind: 0,
    levelUpWork: 0,
    skill1Passive: {
      label: "+5% workout XP",
      workoutXpBonus: 0.05,
      deepWorkXpBonus: 0,
      missionXpBonus: 0,
      allXpBonus: 0,
    },
    skills: [
      {
        id: "iron_body",
        name: "Iron Body",
        description: "Forged through repetition. Your physique hardens with every session.",
      },
      {
        id: "relentless",
        name: "Relentless",
        description: "You push past limits when others stop.",
      },
      {
        id: "beast_mode",
        name: "Beast Mode",
        description: "Raw power unlocked at peak conditioning.",
      },
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    focus: "Mind",
    icon: "📜",
    description: "Discipline of the mind. The Scholar advances through deep work, focus, and mental endurance.",
    bonusSummary: ["+10% deep work XP", "+1 Mind on level up"],
    workoutXpBonus: 0,
    deepWorkXpBonus: 0.1,
    missionXpBonus: 0,
    allXpBonus: 0,
    levelUpBody: 0,
    levelUpMind: 1,
    levelUpWork: 0,
    skill1Passive: {
      label: "+5% deep work XP",
      workoutXpBonus: 0,
      deepWorkXpBonus: 0.05,
      missionXpBonus: 0,
      allXpBonus: 0,
    },
    skills: [
      {
        id: "deep_focus",
        name: "Deep Focus",
        description: "Extended concentration without distraction.",
      },
      {
        id: "knowledge_hunter",
        name: "Knowledge Hunter",
        description: "Every lesson compounds into mastery.",
      },
      {
        id: "mental_fortress",
        name: "Mental Fortress",
        description: "Unshakeable clarity under pressure.",
      },
    ],
  },
  {
    id: "operator",
    name: "Operator",
    focus: "Work",
    icon: "⚙",
    description: "Execution is everything. The Operator completes missions and builds momentum through daily output.",
    bonusSummary: ["+10% mission XP", "+1 Work on level up"],
    workoutXpBonus: 0,
    deepWorkXpBonus: 0,
    missionXpBonus: 0.1,
    allXpBonus: 0,
    levelUpBody: 0,
    levelUpMind: 0,
    levelUpWork: 1,
    skill1Passive: {
      label: "+5% mission XP",
      workoutXpBonus: 0,
      deepWorkXpBonus: 0,
      missionXpBonus: 0.05,
      allXpBonus: 0,
    },
    skills: [
      {
        id: "execution",
        name: "Execution",
        description: "Turn plans into completed missions.",
      },
      {
        id: "consistency",
        name: "Consistency",
        description: "Daily output builds unstoppable momentum.",
      },
      {
        id: "momentum",
        name: "Momentum",
        description: "Each win fuels the next.",
      },
    ],
  },
  {
    id: "monk",
    name: "Monk",
    focus: "Balance",
    icon: "☯",
    description: "The path of equilibrium. The Monk grows steadily across body, mind, and work.",
    bonusSummary: ["+5% all XP", "Balanced stat growth on level up"],
    workoutXpBonus: 0,
    deepWorkXpBonus: 0,
    missionXpBonus: 0,
    allXpBonus: 0.05,
    levelUpBody: 1,
    levelUpMind: 1,
    levelUpWork: 1,
    skill1Passive: {
      label: "+3% all XP",
      workoutXpBonus: 0,
      deepWorkXpBonus: 0,
      missionXpBonus: 0,
      allXpBonus: 0.03,
    },
    skills: [
      {
        id: "discipline",
        name: "Discipline",
        description: "Steady practice across all paths.",
      },
      {
        id: "balance",
        name: "Balance",
        description: "Harmony between body, mind, and work.",
      },
      {
        id: "inner_strength",
        name: "Inner Strength",
        description: "Calm power drawn from equilibrium.",
      },
    ],
  },
];

export const CLASS_CHANGE_COOLDOWN_DAYS = 30;

/** Skill slot index 0 → L5, 1 → L10, 2 → L15 */
export const SKILL_UNLOCK_LEVELS = [5, 10, 15] as const;

export function getSkillRequiredLevel(skillIndex: number): number {
  return SKILL_UNLOCK_LEVELS[skillIndex] ?? 15;
}

export function isSkillUnlockedAtLevel(
  skillIndex: number,
  playerLevel: number
): boolean {
  return playerLevel >= getSkillRequiredLevel(skillIndex);
}

export function getUnlockedSkillCount(playerLevel: number): number {
  return SKILL_UNLOCK_LEVELS.filter((required) => playerLevel >= required).length;
}

export function getClass(classId: ClassId | string | undefined | null) {
  return CLASSES.find((c) => c.id === classId) ?? null;
}

export function getDefaultClassId(): ClassId {
  return "warrior";
}
