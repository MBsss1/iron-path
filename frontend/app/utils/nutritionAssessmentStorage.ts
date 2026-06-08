import type {
  NutritionAssessmentAnswers,
  NutritionLevel,
} from "../data/nutritionAssessment";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type NutritionAssessmentRecord = {
  version: 1;
  completedAt: string | null;
  answers: NutritionAssessmentAnswers | null;
  averageScore: number | null;
  level: NutritionLevel | null;
};

const EMPTY: NutritionAssessmentRecord = {
  version: 1,
  completedAt: null,
  answers: null,
  averageScore: null,
  level: null,
};

export function loadNutritionAssessment(): NutritionAssessmentRecord | null {
  const raw = safeGet<NutritionAssessmentRecord | null>(
    STORAGE_KEYS.nutritionAssessment,
    null
  );
  if (!raw || raw.version !== 1) return null;
  return raw;
}

export function isNutritionAssessmentComplete(
  record: NutritionAssessmentRecord | null
): boolean {
  return Boolean(
    record?.completedAt && record.answers && record.level && record.averageScore
  );
}

export function saveNutritionAssessment(record: NutritionAssessmentRecord): void {
  safeSet(STORAGE_KEYS.nutritionAssessment, record);
}

export function completeNutritionAssessment(
  answers: NutritionAssessmentAnswers,
  averageScore: number,
  level: NutritionLevel
): NutritionAssessmentRecord {
  const record: NutritionAssessmentRecord = {
    version: 1,
    completedAt: new Date().toISOString(),
    answers,
    averageScore,
    level,
  };
  saveNutritionAssessment(record);
  return record;
}

export function clearNutritionAssessment(): void {
  saveNutritionAssessment(EMPTY);
}
