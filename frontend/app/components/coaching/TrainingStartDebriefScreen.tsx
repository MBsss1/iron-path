"use client";

import type { AssessmentInput, AssessmentResult } from "../../data/fitnessAssessment";
import { getStartDebriefFocusKeys } from "../../data/trainingCoaching";
import { useTranslation } from "../../i18n/useTranslation";
import ScreenShell from "../ScreenShell";
import IronButton from "../IronButton";

type Props = {
  input: AssessmentInput;
  result: AssessmentResult;
  variant?: "initial" | "reassessment";
  onContinue: () => void;
};

export default function TrainingStartDebriefScreen({
  input,
  result,
  variant = "initial",
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const levelLabel = t(`assessment.level.${result.overallLevel}`);
  const focusKeys = getStartDebriefFocusKeys(input, result);

  const title =
    variant === "reassessment"
      ? t("coaching.debrief.reassessmentTitle")
      : t("coaching.debrief.title");

  const intro =
    variant === "reassessment"
      ? t("coaching.debrief.reassessmentIntro")
      : t("coaching.debrief.intro");

  return (
    <ScreenShell
      eyebrow={t("coaching.debrief.eyebrow")}
      title={title}
      subtitle={intro}
    >
      <div className="iron-card-panel p-4 space-y-3 text-sm">
        <p className="iron-label">{t("coaching.debrief.resultsTitle")}</p>
        <ul className="space-y-1.5 text-iron-text">
          <li>
            {t("coaching.debrief.metricPullups")}:{" "}
            <span className="font-semibold">{input.maxPullUps}</span>
          </li>
          <li>
            {t("coaching.debrief.metricPushups")}:{" "}
            <span className="font-semibold">{input.maxPushUps}</span>
          </li>
          <li>
            {t("coaching.debrief.metricSquats")}:{" "}
            <span className="font-semibold">{input.squatReps2Min}</span>
          </li>
          <li>
            {t("coaching.debrief.metricPlank")}:{" "}
            <span className="font-semibold">
              {input.plankSeconds} {t("coaching.milestone.unitSeconds")}
            </span>
          </li>
        </ul>

        <p className="pt-2 border-t border-iron-border">
          {t("coaching.debrief.levelLine", { level: levelLabel })}
        </p>
      </div>

      <div className="iron-card-raised p-4">
        <p className="iron-label">{t("coaching.debrief.focusTitle")}</p>
        <ul className="mt-3 space-y-2 text-sm text-iron-text">
          {focusKeys.map((key) => (
            <li key={key} className="flex gap-2">
              <span className="text-iron-accent shrink-0">✓</span>
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-iron-muted leading-relaxed">
          {t("coaching.debrief.foundation")}
        </p>
      </div>

      <IronButton onClick={onContinue}>
        {variant === "reassessment"
          ? t("coaching.debrief.continueReassessment")
          : t("coaching.debrief.continue")}
      </IronButton>
    </ScreenShell>
  );
}
