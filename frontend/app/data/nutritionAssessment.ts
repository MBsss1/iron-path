import type { NutritionMissionId } from "../hooks/useNutritionMissions";

export type NutritionAnswerScore = 1 | 2 | 3 | 4;

export type NutritionAssessmentGoal = "mass_gain" | "weight_loss";

export type MassGainQuestionId =
  | "meals_per_day"
  | "protein_frequency"
  | "portion_size"
  | "skip_meals"
  | "snacks"
  | "water"
  | "weight_trend"
  | "weigh_frequency";

export type MassGainDiagnosisId =
  | "calorie_deficit"
  | "low_protein"
  | "lack_of_consistency"
  | "tracking_problem"
  | "strong_foundation";

export type NutritionLevel =
  | "undereating"
  | "basic"
  | "good"
  | "advanced";

export type MassGainAssessmentAnswers = Record<
  MassGainQuestionId,
  NutritionAnswerScore
>;

export const MASS_GAIN_QUESTION_IDS: MassGainQuestionId[] = [
  "meals_per_day",
  "protein_frequency",
  "portion_size",
  "skip_meals",
  "snacks",
  "water",
  "weight_trend",
  "weigh_frequency",
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

export type NutritionAssessmentResult = {
  averageScore: number;
  level: NutritionLevel;
  diagnosis: MassGainDiagnosisId;
};

function severity(score: NutritionAnswerScore): number {
  return 5 - score;
}

function averageSeverity(scores: NutritionAnswerScore[]): number {
  return scores.reduce((sum, score) => sum + severity(score), 0) / scores.length;
}

export function calculateNutritionAverageScore(
  answers: MassGainAssessmentAnswers
): number {
  const scores = MASS_GAIN_QUESTION_IDS.map((id) => answers[id]);
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

export function resolveMassGainDiagnosis(
  answers: MassGainAssessmentAnswers
): MassGainDiagnosisId {
  const issueScores: { id: MassGainDiagnosisId; severity: number }[] = [
    {
      id: "calorie_deficit",
      severity: averageSeverity([
        answers.meals_per_day,
        answers.portion_size,
        answers.snacks,
        answers.weight_trend,
      ]),
    },
    {
      id: "low_protein",
      severity: severity(answers.protein_frequency),
    },
    {
      id: "lack_of_consistency",
      severity: severity(answers.skip_meals),
    },
    {
      id: "tracking_problem",
      severity: severity(answers.weigh_frequency),
    },
  ];

  const priority: MassGainDiagnosisId[] = [
    "calorie_deficit",
    "low_protein",
    "lack_of_consistency",
    "tracking_problem",
  ];

  const maxSeverity = Math.max(...issueScores.map((issue) => issue.severity));
  if (maxSeverity < 1.75) {
    return "strong_foundation";
  }

  const topSeverity = issueScores.filter((issue) => issue.severity === maxSeverity);
  for (const id of priority) {
    if (topSeverity.some((issue) => issue.id === id)) {
      return id;
    }
  }

  return "calorie_deficit";
}

export function assessMassGainAnswers(
  answers: MassGainAssessmentAnswers
): NutritionAssessmentResult {
  const averageScore = calculateNutritionAverageScore(answers);
  return {
    averageScore,
    level: resolveNutritionLevel(averageScore),
    diagnosis: resolveMassGainDiagnosis(answers),
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

/** @deprecated Use MassGainAssessmentAnswers */
export type NutritionAssessmentAnswers = MassGainAssessmentAnswers;

/** @deprecated Use MASS_GAIN_QUESTION_IDS */
export const NUTRITION_QUESTION_IDS = MASS_GAIN_QUESTION_IDS;

/** @deprecated Use assessMassGainAnswers */
export function assessNutritionAnswers(
  answers: MassGainAssessmentAnswers
): { averageScore: number; level: NutritionLevel } {
  const result = assessMassGainAnswers(answers);
  return { averageScore: result.averageScore, level: result.level };
}
