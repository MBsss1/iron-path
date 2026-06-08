import type { NutritionAnswerScore } from "./nutritionAssessment";
import {
  resolveNutritionLevel,
  type NutritionLevel,
} from "./nutritionAssessment";

export type WeightLossQuestionId =
  | "sugary_beverages"
  | "sweets_fast_food"
  | "overeating"
  | "vegetables"
  | "daily_activity"
  | "water"
  | "weight_trend"
  | "weight_monitoring";

export type WeightLossDiagnosisId =
  | "excess_calories"
  | "high_processed_food"
  | "low_activity"
  | "no_progress_tracking"
  | "on_track";

export type WeightLossAssessmentAnswers = Record<
  WeightLossQuestionId,
  NutritionAnswerScore
>;

export const WEIGHT_LOSS_QUESTION_IDS: WeightLossQuestionId[] = [
  "sugary_beverages",
  "sweets_fast_food",
  "overeating",
  "vegetables",
  "daily_activity",
  "water",
  "weight_trend",
  "weight_monitoring",
];

export type WeightLossAssessmentResult = {
  averageScore: number;
  level: NutritionLevel;
  diagnosis: WeightLossDiagnosisId;
};

function severity(score: NutritionAnswerScore): number {
  return 5 - score;
}

function averageSeverity(scores: NutritionAnswerScore[]): number {
  return scores.reduce((sum, score) => sum + severity(score), 0) / scores.length;
}

export function calculateWeightLossAverageScore(
  answers: WeightLossAssessmentAnswers
): number {
  const scores = WEIGHT_LOSS_QUESTION_IDS.map((id) => answers[id]);
  if (scores.some((score) => score < 1 || score > 4)) {
    return 1;
  }
  const sum = scores.reduce((total, score) => total + score, 0);
  return sum / scores.length;
}

export function resolveWeightLossDiagnosis(
  answers: WeightLossAssessmentAnswers
): WeightLossDiagnosisId {
  const issueScores: { id: WeightLossDiagnosisId; severity: number }[] = [
    {
      id: "excess_calories",
      severity: averageSeverity([
        answers.sugary_beverages,
        answers.sweets_fast_food,
        answers.overeating,
        answers.weight_trend,
      ]),
    },
    {
      id: "high_processed_food",
      severity: averageSeverity([
        answers.sugary_beverages,
        answers.sweets_fast_food,
      ]),
    },
    {
      id: "low_activity",
      severity: severity(answers.daily_activity),
    },
    {
      id: "no_progress_tracking",
      severity: severity(answers.weight_monitoring),
    },
  ];

  const priority: WeightLossDiagnosisId[] = [
    "excess_calories",
    "high_processed_food",
    "low_activity",
    "no_progress_tracking",
  ];

  const maxSeverity = Math.max(...issueScores.map((issue) => issue.severity));
  if (maxSeverity < 1.75) {
    return "on_track";
  }

  const topSeverity = issueScores.filter((issue) => issue.severity === maxSeverity);
  for (const id of priority) {
    if (topSeverity.some((issue) => issue.id === id)) {
      return id;
    }
  }

  return "excess_calories";
}

export function assessWeightLossAnswers(
  answers: WeightLossAssessmentAnswers
): WeightLossAssessmentResult {
  const averageScore = calculateWeightLossAverageScore(answers);
  return {
    averageScore,
    level: resolveNutritionLevel(averageScore),
    diagnosis: resolveWeightLossDiagnosis(answers),
  };
}
