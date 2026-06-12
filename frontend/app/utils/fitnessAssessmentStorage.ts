import type {
  AssessmentInput,
  AssessmentResult,
} from "../data/fitnessAssessment";
import { safeGet, safeSet } from "./storage";
import { STORAGE_KEYS } from "./storageKeys";

export type FitnessAssessmentRecord = {
  version: 1;
  completedAt: string | null;
  input: AssessmentInput | null;
  result: AssessmentResult | null;
};

const EMPTY: FitnessAssessmentRecord = {
  version: 1,
  completedAt: null,
  input: null,
  result: null,
};

export function loadFitnessAssessment(): FitnessAssessmentRecord | null {
  const raw = safeGet<FitnessAssessmentRecord | null>(
    STORAGE_KEYS.fitnessAssessment,
    null
  );
  if (!raw || raw.version !== 1) return null;
  return raw;
}

export function isFitnessAssessmentComplete(
  record: FitnessAssessmentRecord | null
): boolean {
  return Boolean(record?.completedAt && record.input && record.result);
}

export function saveFitnessAssessment(
  record: FitnessAssessmentRecord
): void {
  safeSet(STORAGE_KEYS.fitnessAssessment, record);
}

export function completeFitnessAssessment(
  input: AssessmentInput,
  result: AssessmentResult
): FitnessAssessmentRecord {
  const record: FitnessAssessmentRecord = {
    version: 1,
    completedAt: new Date().toISOString(),
    input,
    result,
  };
  saveFitnessAssessment(record);
  return record;
}

export function clearFitnessAssessment(): void {
  saveFitnessAssessment(EMPTY);
}
