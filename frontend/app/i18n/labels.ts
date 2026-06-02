import type { AchievementId } from "../data/achievements";
import type { BossDefinition } from "../data/bosses";
import type { ClassId } from "../data/classes";
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

const GOAL_IDS = ["mass_gain", "athletic", "runner", "fat_loss"] as const;

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

export function translateGoal(goal: string | undefined, t: TranslateFn): string {
  if (!goal) return t("goal.general");
  if (GOAL_IDS.includes(goal as (typeof GOAL_IDS)[number])) {
    return t(`goal.${goal}`);
  }
  return goal.replace(/_/g, " ");
}

export function translateExperience(value: string, t: TranslateFn): string {
  return t(`experience.${value}`);
}

export function translateWatch(value: string, t: TranslateFn): string {
  return t(`watch.${value}`);
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
  t: TranslateFn
): string {
  return t(`nutrition.mission.${id}`);
}

export function getTranslatedNutritionTips(
  goal: string | undefined,
  t: TranslateFn
): string[] {
  const tipGoal =
    goal && GOAL_IDS.includes(goal as (typeof GOAL_IDS)[number])
      ? goal
      : "default";

  return ["0", "1", "2", "3"].map((index) =>
    t(`nutrition.tip.${tipGoal}.${index}`)
  );
}

export function translatePhase(phaseName: string, t: TranslateFn): string {
  const key = PHASE_KEY_BY_EN[phaseName];
  return key ? t(key) : phaseName;
}

export function translateAchievement(
  id: AchievementId,
  field: "title" | "description",
  fallback: string,
  t: TranslateFn
): string {
  return tr(t, `achievement.${id}.${field}`, undefined, fallback);
}

export function translateBossField(
  boss: BossDefinition,
  field: "name" | "description",
  t: TranslateFn
): string {
  return tr(t, `boss.id.${boss.id}.${field}`, undefined, boss[field]);
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
