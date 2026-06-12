import type { AchievementCategory, AchievementId } from "../data/achievements";
import type { BossDefinition, BossTier } from "../data/bosses";
import { BOSS_TIERS } from "../data/bosses";
import type { BossTrialId } from "../data/bossTrials";
import type { DayType } from "../data/workoutGeneratorV2";
import type { AvatarId } from "../data/avatar";
import type { ClassId } from "../data/classes";
import type { NutritionLevel } from "../data/nutritionAssessment";
import type { PlayerRankId } from "../data/playerRanks";
import type { NutritionMissionId } from "../hooks/useNutritionMissions";
import {
  getRequirementProgress,
  type BossProgressContext,
} from "../utils/bossProgress";
import type { TranslationParams } from "./index";

export type TranslateFn = (key: string, params?: TranslationParams) => string;

const RANK_KEY_BY_EN: Record<string, string> = {
  Awakening: "rank.awakening",
  Disciplined: "rank.disciplined",
  "Street Athlete": "rank.streetAthlete",
  "Iron Runner": "rank.ironRunner",
  "Built Different": "rank.builtDifferent",
  "Iron Legend": "rank.ironLegend",
  "MAX RANK": "rank.max",
};

import { goalDisplayI18nKey, normalizeFitnessGoal } from "../data/fitnessGoals";

const PHASE_KEY_BY_EN: Record<string, string> = {
  Foundation: "phase.foundation",
  Building: "phase.building",
  Strength: "phase.strength",
  Hypertrophy: "phase.hypertrophy",
  Athlete: "phase.athlete",
  "Final Form": "phase.finalForm",
};

function tr(
  t: TranslateFn,
  key: string,
  params?: TranslationParams,
  fallback?: string
): string {
  const value = t(key, params);
  return value === key && fallback !== undefined ? fallback : value;
}

export function translateRank(rankEn: string, t: TranslateFn): string {
  const key = RANK_KEY_BY_EN[rankEn];
  return key ? t(key) : rankEn;
}

export function translatePlayerRank(rankId: PlayerRankId, t: TranslateFn): string {
  return t(`playerRank.${rankId}`);
}

export function translateGoal(goal: string | undefined, t: TranslateFn): string {
  return t(goalDisplayI18nKey(goal));
}

export function translateExperience(value: string, t: TranslateFn): string {
  return t(`experience.${value}`);
}

export function translateClassName(classId: ClassId, t: TranslateFn): string {
  return t(`class.${classId}.name`);
}

export function translateClassFocus(classId: ClassId, t: TranslateFn): string {
  return t(`class.${classId}.focus`);
}

export function translateClassDescription(classId: ClassId, t: TranslateFn): string {
  return t(`class.${classId}.description`);
}

export function translateClassBonuses(classId: ClassId, t: TranslateFn): string[] {
  return [t(`class.${classId}.bonus0`), t(`class.${classId}.bonus1`)];
}

export function translateNutritionMission(
  id: NutritionMissionId,
  t: TranslateFn,
  level?: NutritionLevel | null
): string {
  if (level) {
    const levelKey = `nutrition.missionLevel.${level}.${id}`;
    const levelLabel = t(levelKey);
    if (levelLabel !== levelKey) {
      return levelLabel;
    }
  }
  return t(`nutrition.mission.${id}`);
}

export function getTranslatedNutritionTips(
  goal: string | undefined,
  t: TranslateFn
): string[] {
  const tipGoal = goal ? normalizeFitnessGoal(goal) : "default";

  return ["0", "1", "2", "3"].map((index) =>
    t(`nutrition.tip.${tipGoal}.${index}`)
  );
}

export function translatePhase(phaseName: string, t: TranslateFn): string {
  const key = PHASE_KEY_BY_EN[phaseName];
  return key ? t(key) : phaseName;
}

const PROGRAM_WORKOUT_KEY_BY_EN: Record<string, string> = {
  Push: "program.workout.push",
  Pull: "program.workout.pull",
  "Pull + Easy Run": "program.workout.pull_easy_run",
  "Legs + Intervals": "program.workout.legs_intervals",
  "Full Body": "program.workout.full_body",
  "Easy Run": "program.workout.easy_run",
  Intervals: "program.workout.intervals",
  Strength: "program.workout.strength",
  "Long Run": "program.workout.long_run",
  Run: "program.workout.run",
  Walk: "program.workout.walk",
};

const PHASE_FOCUS_KEY_BY_NAME: Record<string, string> = {
  Foundation: "phase.focus.foundation",
  Building: "phase.focus.building",
  Strength: "phase.focus.strength",
  Hypertrophy: "phase.focus.hypertrophy",
  Athlete: "phase.focus.athlete",
  "Final Form": "phase.focus.finalForm",
};

const MISSION_TITLE_KEY_BY_EN: Record<string, string> = {
  "Pull Day": "workoutPlan.title.pullDay",
  "Runner Foundation": "workoutPlan.title.runnerFoundation",
  "Runner Strength": "workoutPlan.title.runnerStrength",
  "Runner Elite": "workoutPlan.title.runnerElite",
  "Conditioning Day": "workoutPlan.title.conditioningDay",
  "Hybrid Foundation": "workoutPlan.title.hybridFoundation",
  "Hybrid Strength": "workoutPlan.title.hybridStrength",
  "Hybrid Elite": "workoutPlan.title.hybridElite",
};

const EXERCISE_KEY_BY_EN: Record<string, string> = {
  "Warm-up Walk": "workoutPlan.exercise.warmUpWalk",
  "Easy Run": "workoutPlan.exercise.easyRun",
  Mobility: "workoutPlan.exercise.mobility",
  Plank: "workoutPlan.exercise.plank",
  Intervals: "workoutPlan.exercise.intervals",
  "Split Squats": "workoutPlan.exercise.splitSquats",
  "Long Run": "workoutPlan.exercise.longRun",
  "Core Circuit": "workoutPlan.exercise.coreCircuit",
  "Push-ups": "workoutPlan.exercise.pushUps",
  Squats: "workoutPlan.exercise.squats",
  "Mountain Climbers": "workoutPlan.exercise.mountainClimbers",
  "Pull-ups": "workoutPlan.exercise.pullUps",
  Dips: "workoutPlan.exercise.dips",
  "Bulgarian Squats": "workoutPlan.exercise.bulgarianSquats",
  Run: "workoutPlan.exercise.run",
  "Pistol Squats": "workoutPlan.exercise.pistolSquats",
  "Australian Rows": "workoutPlan.exercise.australianRows",
  "Backpack Rows": "workoutPlan.exercise.backpackRows",
  "Hanging Knee Raises": "workoutPlan.exercise.hangingKneeRaises",
};

const PRESCRIPTION_KEY_BY_EN: Record<string, string> = {
  "5 min": "workoutPlan.prescription.min5",
  "10 min": "workoutPlan.prescription.min10",
  "15 min": "workoutPlan.prescription.min15",
  "2 km": "workoutPlan.prescription.km2",
  "3 km": "workoutPlan.prescription.km3",
  "4 km": "workoutPlan.prescription.km4",
  "5 km": "workoutPlan.prescription.km5",
  "8 km": "workoutPlan.prescription.km8",
  "3×30 sec": "workoutPlan.prescription.sec3x30",
  "3×60 sec": "workoutPlan.prescription.sec3x60",
  "6×200m": "workoutPlan.prescription.m6x200",
  "8×400m": "workoutPlan.prescription.m8x400",
  "3×12": "workoutPlan.prescription.x3x12",
  "4 rounds": "workoutPlan.prescription.rounds4",
  "4×10": "workoutPlan.prescription.x4x10",
  "4×20": "workoutPlan.prescription.x4x20",
  "4×30 sec": "workoutPlan.prescription.sec4x30",
  "3×max": "workoutPlan.prescription.max3x",
  "3×15": "workoutPlan.prescription.x3x15",
  "3×20": "workoutPlan.prescription.x3x20",
  "5×max": "workoutPlan.prescription.max5x",
  "5×10": "workoutPlan.prescription.x5x10",
  "4×12": "workoutPlan.prescription.x4x12",
  "6×max": "workoutPlan.prescription.max6x",
  "6×12": "workoutPlan.prescription.x6x12",
  "4×8": "workoutPlan.prescription.x4x8",
  "4×max": "workoutPlan.prescription.max4x",
  "4×10-15": "workoutPlan.prescription.x4x10_15",
};

export type WorkoutMissionInput = {
  title: string;
  exercises: string[][];
};

export type WorkoutMission = {
  title: string;
  exercises: [string, string][];
};

export function translateDayType(dayType: DayType, t: TranslateFn): string {
  return t(`training.dayType.${dayType}`);
}

export function translateProgramWorkout(
  workoutLabel: string,
  t: TranslateFn
): string {
  const key = PROGRAM_WORKOUT_KEY_BY_EN[workoutLabel];
  return key ? tr(t, key, undefined, workoutLabel) : workoutLabel;
}

export function translatePhaseFocus(
  phaseName: string,
  focusFallback: string,
  t: TranslateFn
): string {
  const key = PHASE_FOCUS_KEY_BY_NAME[phaseName];
  if (key) return tr(t, key, undefined, focusFallback);
  return focusFallback;
}

function translateExerciseName(name: string, t: TranslateFn): string {
  const key = EXERCISE_KEY_BY_EN[name];
  return key ? tr(t, key, undefined, name) : name;
}

function translatePrescription(value: string, t: TranslateFn): string {
  const key = PRESCRIPTION_KEY_BY_EN[value];
  return key ? tr(t, key, undefined, value) : value;
}

export function translateWorkoutMission(
  mission: WorkoutMissionInput,
  t: TranslateFn
): WorkoutMission {
  const titleKey = MISSION_TITLE_KEY_BY_EN[mission.title];
  return {
    title: titleKey
      ? tr(t, titleKey, undefined, mission.title)
      : mission.title,
    exercises: mission.exercises.map((row) => {
      const [name, value] = row;
      return [
        translateExerciseName(name, t),
        translatePrescription(value, t),
      ] as [string, string];
    }),
  };
}

export function translateAchievement(
  id: AchievementId,
  field: "title" | "description" | "hint",
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `achievement.${id}.${field}`, undefined, fallback);
}

export function translateAchievementCategory(
  category: AchievementCategory,
  t: TranslateFn
): string {
  return t(`achievementCategory.${category}`);
}

export function translateClassSkill(
  classId: ClassId,
  skillId: string,
  field: "name" | "description",
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `skill.${classId}.${skillId}.${field}`, undefined, fallback);
}

export function translateSkillPassive(
  classId: ClassId,
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `skill.passive.${classId}`, undefined, fallback);
}

export function translateAvatarLabel(
  avatarId: string,
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `avatar.${avatarId}.label`, undefined, fallback);
}

export function translateBossField(
  boss: BossDefinition,
  field: "name" | "description",
  t: TranslateFn
): string {
  return tr(t, `boss.id.${boss.id}.${field}`, undefined, boss[field]);
}

export function translateBossLore(boss: BossDefinition, t: TranslateFn): string {
  return tr(t, `boss.id.${boss.id}.lore`, undefined, boss.lore);
}

export function translateBossTier(tier: BossTier, t: TranslateFn): string {
  const fallback = BOSS_TIERS.find((row) => row.tier === tier)?.label ?? "";
  return tr(t, `boss.tier.${tier}`, undefined, fallback);
}

export function translateBossDifficulty(
  difficulty: BossDefinition["difficulty"],
  t: TranslateFn
): string {
  const key = difficulty.toLowerCase();
  return tr(t, `boss.difficulty.${key}`, undefined, difficulty);
}

export function translateBossRewardTitle(boss: BossDefinition, t: TranslateFn): string {
  return tr(
    t,
    `boss.titles.${boss.rewards.titleId}`,
    undefined,
    boss.rewards.title
  );
}

export function translateBossRewardTitleById(
  titleId: string | null | undefined,
  t: TranslateFn
): string | null {
  if (!titleId) return null;
  return tr(t, `boss.titles.${titleId}`, undefined, titleId);
}

export function translateBossBadge(badgeId: string, t: TranslateFn): string {
  return tr(t, `boss.badge.${badgeId}`, undefined, badgeId.replace(/_/g, " "));
}

export function translateBossTrialField(
  trialId: BossTrialId,
  field: "title" | "description",
  trial: { title: string; description: string },
  t: TranslateFn
): string {
  return tr(t, `boss.trial.${trialId}.${field}`, undefined, trial[field]);
}

export function translateBossTrialRequirement(
  trialId: BossTrialId,
  index: number,
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `boss.trial.${trialId}.requirements.${index}`, undefined, fallback);
}

export function translateBossRequirement(
  boss: BossDefinition,
  t: TranslateFn
): string {
  const { type, target } = boss.requirement;
  return tr(
    t,
    `boss.req.${type}`,
    { target },
    boss.requirement.label
  );
}

export function translateBossProgressLabel(
  boss: BossDefinition,
  ctx: BossProgressContext,
  t: TranslateFn
): string {
  const current = getRequirementProgress(boss.requirement.type, ctx);
  const target = boss.requirement.target;

  switch (boss.requirement.type) {
    case "totalXp":
      return t("boss.progress.xp", { current, target });
    case "allBossesDefeated":
      return t("boss.progress.bossesDefeated", { current, target });
    case "streakDays":
      return t("boss.progress.streak", { current, target });
    case "workouts":
      return t("boss.progress.workouts", { current, target });
    case "dailyMissions":
      return t("boss.progress.missions", { current, target });
    case "deepWorkSessions":
      return t("boss.progress.focus", { current, target });
    default:
      return `${current} / ${target}`;
  }
}
