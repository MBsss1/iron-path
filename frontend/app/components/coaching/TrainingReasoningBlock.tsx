"use client";

import type { AssessmentInput, AssessmentResult } from "../../data/fitnessAssessment";
import type { DayType } from "../../data/workoutGeneratorV2";
import { getTrainingReasonKeys } from "../../data/trainingCoaching";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  input: AssessmentInput;
  result: AssessmentResult;
  dayType?: DayType;
};

export default function TrainingReasoningBlock({ input, result, dayType }: Props) {
  const { t } = useTranslation();
  const keys = getTrainingReasonKeys(input, result, dayType);

  return (
    <div className="border border-iron-border iron-card-panel p-4 rounded-sm">
      <p className="iron-label">{t("coaching.reason.title")}</p>
      <ul className="mt-3 space-y-2 text-sm text-iron-text leading-relaxed">
        {keys.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
    </div>
  );
}
