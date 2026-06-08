"use client";

import { useCallback, useEffect, useState } from "react";
import {
  assessNutritionAnswers,
  type NutritionAssessmentAnswers,
  type NutritionLevel,
} from "../data/nutritionAssessment";
import type { Profile } from "./useProfile";
import {
  completeNutritionAssessment,
  isNutritionAssessmentComplete,
  loadNutritionAssessment,
  type NutritionAssessmentRecord,
} from "../utils/nutritionAssessmentStorage";

export function useNutritionAssessment(profile: Profile | null) {
  const [record, setRecord] = useState<NutritionAssessmentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setRecord(loadNutritionAssessment());
      setLoaded(true);
    });
  }, []);

  const isComplete =
    isNutritionAssessmentComplete(record) ||
    Boolean(profile?.nutritionAssessmentCompletedAt && profile?.nutritionLevel);

  const level: NutritionLevel | null =
    record?.level ?? profile?.nutritionLevel ?? null;

  const complete = useCallback((answers: NutritionAssessmentAnswers) => {
    const { averageScore, level: resolvedLevel } = assessNutritionAnswers(answers);
    const saved = completeNutritionAssessment(
      answers,
      averageScore,
      resolvedLevel
    );
    setRecord(saved);
    return { averageScore, level: resolvedLevel };
  }, []);

  return {
    loaded,
    record,
    isComplete,
    level,
    complete,
  };
}
