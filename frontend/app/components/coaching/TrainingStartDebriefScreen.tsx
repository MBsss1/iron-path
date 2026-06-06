"use client";

import {
  getAssessmentCardioResultsMode,
  resolveCardioTestType,
  shouldAvoidRunning,
  type AssessmentInput,
  type AssessmentResult,
} from "../../data/fitnessAssessment";
import { getGoalOrderedMilestones } from "../../data/physicalMilestones";
import { getStartDebriefFocusKeys } from "../../data/trainingCoaching";
import { useTranslation } from "../../i18n/useTranslation";
import ScreenShell from "../ScreenShell";
import IronButton from "../IronButton";
import PhysicalTrackGoalCard from "../progress/PhysicalTrackGoalCard";

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
  const stageGoals = getGoalOrderedMilestones(input)
    .filter((m) => m.nextRung !== null)
    .slice(0, 5);
  const cardioMode = getAssessmentCardioResultsMode(input);
  const cardioTestType = resolveCardioTestType(input);
  const avoidRunning = shouldAvoidRunning(input.cardioAccess, input.cardioPreference);

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
          {cardioMode === "run" && (
            <li>
              {t("coaching.debrief.metricRun")}:{" "}
              <span className="font-semibold">
                {input.runMinutes ?? 0} {t("coaching.milestone.unitMinutes")}
              </span>
            </li>
          )}
          {cardioMode === "walk" && (
            <li>
              {t("coaching.debrief.metricWalk")}:{" "}
              <span className="font-semibold">
                {input.walkMinutes ?? 0} {t("coaching.milestone.unitMinutes")}
              </span>
            </li>
          )}
          {cardioMode === "low_impact" && (
            <li className="leading-relaxed">
              {t("coaching.debrief.metricCardioSkipped")}:{" "}
              <span className="font-semibold">
                {t("assessment.results.cardioWalkLowImpact")}
              </span>
              {cardioTestType === "walk" && (
                <span className="block mt-1 text-iron-muted">
                  {t("coaching.debrief.metricWalk")}:{" "}
                  <span className="font-semibold text-iron-text">
                    {input.walkMinutes ?? 0}{" "}
                    {t("coaching.milestone.unitMinutes")}
                  </span>
                </span>
              )}
              {avoidRunning && (
                <span className="block mt-1 text-iron-muted">
                  {t("assessment.results.cardioNoRunning")}
                </span>
              )}
            </li>
          )}
        </ul>

        <p className="pt-2 border-t border-iron-border">
          {t("coaching.debrief.levelLine", { level: levelLabel })}
        </p>
      </div>

      {stageGoals.length > 0 && (
        <div className="space-y-3">
          <p className="iron-label">{t("coaching.debrief.goalsTitle")}</p>
          {stageGoals.map((goal) => (
            <PhysicalTrackGoalCard key={goal.id} track={goal} compact />
          ))}
        </div>
      )}

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
