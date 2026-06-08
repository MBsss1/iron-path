import type { NutritionMissionId } from "../hooks/useNutritionMissions";

export type NutritionAnswerScore = 1 | 2 | 3 | 4;

export type NutritionQuestionId =
  | "meals_per_day"
  | "protein_frequency"
  | "portion_size"
  | "skip_meals"
  | "snacks"
  | "water";

export type NutritionLevel =
  | "undereating"
  | "basic"
  | "good"
  | "advanced";

export type NutritionAssessmentAnswers = Record<
  NutritionQuestionId,
  NutritionAnswerScore
>;

export const NUTRITION_QUESTION_IDS: NutritionQuestionId[] = [
  "meals_per_day",
  "protein_frequency",
  "portion_size",
  "skip_meals",
  "snacks",
  "water",
];

export const NUTRITION_MISSIONS_BY_LEVEL: Record<
  NutritionLevel,
  NutritionMissionId[]
> = {
  undereating: ["meals_3_plus", "protein_target", "water_2l", "no_junk"],
  basic: ["protein_target", "meals_3_plus", "water_2l", "no_junk"],
  good: ["protein_target", "meals_3_plus", "water_2l", "no_junk"],
  advanced: ["protein_target", "meals_3_plus", "water_2l", "no_junk"],
};

export function calculateNutritionAverageScore(
  answers: NutritionAssessmentAnswers
): number {
  const scores = NUTRITION_QUESTION_IDS.map((id) => answers[id]);
  if (scores.some((score) => score < 1 || score > 4)) {
    return 1;
  }
  const sum = scores.reduce((total, score) => total + score, 0);
  return sum / scores.length;
}

export function resolveNutritionLevel(averageScore: number): NutritionLevel {
  if (averageScore <= 1.75) return "undereating";
  if (averageScore <= 2.5) return "basic";
  if (averageScore <= 3.25) return "good";
  return "advanced";
}

export function assessNutritionAnswers(
  answers: NutritionAssessmentAnswers
): { averageScore: number; level: NutritionLevel } {
  const averageScore = calculateNutritionAverageScore(answers);
  return {
    averageScore,
    level: resolveNutritionLevel(averageScore),
  };
}

export function getNutritionMissionIdsForLevel(
  level: NutritionLevel | null | undefined
): NutritionMissionId[] {
  if (!level) {
    return NUTRITION_MISSIONS_BY_LEVEL.basic;
  }
  return NUTRITION_MISSIONS_BY_LEVEL[level];
}
