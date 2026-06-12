"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AssessmentInput,
  AssessmentResult,
} from "../data/fitnessAssessment";
import { assessFitness } from "../data/fitnessAssessment";
import {
  completeFitnessAssessment,
  isFitnessAssessmentComplete,
  loadFitnessAssessment,
  type FitnessAssessmentRecord,
} from "../utils/fitnessAssessmentStorage";

export function useFitnessAssessment() {
  const [record, setRecord] = useState<FitnessAssessmentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setRecord(loadFitnessAssessment());
      setLoaded(true);
    });
  }, []);

  const isComplete = isFitnessAssessmentComplete(record);

  const complete = useCallback((input: AssessmentInput) => {
    const result = assessFitness(input);
    const saved = completeFitnessAssessment(input, result);
    setRecord(saved);
    return { input, result };
  }, []);

  return {
    loaded,
    record,
    isComplete,
    input: record?.input ?? null,
    result: record?.result ?? null,
    complete,
  };
}
