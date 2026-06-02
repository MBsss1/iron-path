import type { ClassId } from "../data/classes";
import type { NutritionMissionId } from "../hooks/useNutritionMissions";
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
