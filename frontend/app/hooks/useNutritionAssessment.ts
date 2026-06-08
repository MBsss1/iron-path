"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizeFitnessGoal } from "../data/fitnessGoals";
import {
  assessMassGainAnswers,
  type MassGainAssessmentAnswers,
  type NutritionAssessmentGoal,
  type NutritionLevel,
} from "../data/nutritionAssessment";
import {
  assessWeightLossAnswers,
  type WeightLossAssessmentAnswers,
} from "../data/nutritionWeightLossAssessment";
import type { Profile } from "./useProfile";
import {
  completeNutritionAssessment,
  isNutritionAssessmentComplete,
  loadNutritionAssessment,
  type NutritionAssessmentRecord,
  type NutritionDiagnosisId,
} from "../utils/nutritionAssessmentStorage";

function resolveAssessmentGoal(goal?: string): NutritionAssessmentGoal | null {
  const normalized = normalizeFitnessGoal(goal);
  if (normalized === "mass_gain" || normalized === "weight_loss") {
    return normalized;
  }
  return null;
}

export function useNutritionAssessment(profile: Profile | null, goal?: string) {
  const assessmentGoal = resolveAssessmentGoal(goal);
  const [record, setRecord] = useState<NutritionAssessmentRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setRecord(loadNutritionAssessment());
      setLoaded(true);
    });
  }, []);

  const recordMatchesGoal =
    !assessmentGoal ||
    (record?.goal ?? "mass_gain") === assessmentGoal;

  const profileLegacyComplete =
    !record &&
    Boolean(profile?.nutritionAssessmentCompletedAt && profile?.nutritionLevel) &&
    (!assessmentGoal || assessmentGoal === resolveAssessmentGoal(profile?.goal));

  const isComplete =
    isNutritionAssessmentComplete(record, assessmentGoal ?? undefined) ||
    profileLegacyComplete;

  const level: NutritionLevel | null = recordMatchesGoal
    ? (record?.level ?? profile?.nutritionLevel ?? null)
    : (profile?.nutritionLevel ?? null);

  const diagnosis: NutritionDiagnosisId | null = recordMatchesGoal
    ? (record?.diagnosis ?? null)
    : null;

  const complete = useCallback(
    (answers: MassGainAssessmentAnswers | WeightLossAssessmentAnswers) => {
      if (!assessmentGoal) {
        throw new Error("Nutrition assessment requires a supported goal");
      }

      const result =
        assessmentGoal === "mass_gain"
          ? assessMassGainAnswers(answers as MassGainAssessmentAnswers)
          : assessWeightLossAnswers(answers as WeightLossAssessmentAnswers);

      const saved = completeNutritionAssessment({
        goal: assessmentGoal,
        answers,
        averageScore: result.averageScore,
        level: result.level,
        diagnosis: result.diagnosis,
      });
      setRecord(saved);
      return result;
    },
    [assessmentGoal]
  );

  return {
    loaded,
    record,
    assessmentGoal,
    isComplete,
    level,
    diagnosis,
    complete,
  };
}
