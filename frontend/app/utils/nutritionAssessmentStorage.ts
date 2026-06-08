import type {
  MassGainAssessmentAnswers,
  MassGainDiagnosisId,
  NutritionAssessmentGoal,
  NutritionLevel,
} from "../data/nutritionAssessment";
import type {
  WeightLossAssessmentAnswers,
  WeightLossDiagnosisId,
} from "../data/nutritionWeightLossAssessment";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type NutritionAssessmentAnswers =
  | MassGainAssessmentAnswers
  | WeightLossAssessmentAnswers;

export type NutritionDiagnosisId = MassGainDiagnosisId | WeightLossDiagnosisId;

export type NutritionAssessmentRecord = {
  version: 1 | 2;
  goal?: NutritionAssessmentGoal;
  completedAt: string | null;
  answers: NutritionAssessmentAnswers | null;
  averageScore: number | null;
  level: NutritionLevel | null;
  diagnosis?: NutritionDiagnosisId | null;
};

const EMPTY: NutritionAssessmentRecord = {
  version: 2,
  goal: undefined,
  completedAt: null,
  answers: null,
  averageScore: null,
  level: null,
  diagnosis: null,
};

function normalizeRecord(
  raw: NutritionAssessmentRecord | null
): NutritionAssessmentRecord | null {
  if (!raw) return null;
  if (raw.version !== 1 && raw.version !== 2) return null;

  if (raw.version === 1 && raw.completedAt) {
    return {
      ...raw,
      version: 2,
      goal: "mass_gain",
    };
  }

  return raw;
}

export function loadNutritionAssessment(): NutritionAssessmentRecord | null {
  const raw = safeGet<NutritionAssessmentRecord | null>(
    STORAGE_KEYS.nutritionAssessment,
    null
  );
  return normalizeRecord(raw);
}

export function isNutritionAssessmentComplete(
  record: NutritionAssessmentRecord | null,
  goal?: NutritionAssessmentGoal
): boolean {
  if (!record?.completedAt || !record.answers || !record.level || !record.averageScore) {
    return false;
  }

  if (!goal) {
    return true;
  }

  const recordGoal = record.goal ?? "mass_gain";
  return recordGoal === goal;
}

export function saveNutritionAssessment(record: NutritionAssessmentRecord): void {
  safeSet(STORAGE_KEYS.nutritionAssessment, record);
}

export function completeNutritionAssessment(input: {
  goal: NutritionAssessmentGoal;
  answers: NutritionAssessmentAnswers;
  averageScore: number;
  level: NutritionLevel;
  diagnosis: NutritionDiagnosisId;
}): NutritionAssessmentRecord {
  const record: NutritionAssessmentRecord = {
    version: 2,
    goal: input.goal,
    completedAt: new Date().toISOString(),
    answers: input.answers,
    averageScore: input.averageScore,
    level: input.level,
    diagnosis: input.diagnosis,
  };
  saveNutritionAssessment(record);
  return record;
}

export function clearNutritionAssessment(): void {
  saveNutritionAssessment(EMPTY);
}
