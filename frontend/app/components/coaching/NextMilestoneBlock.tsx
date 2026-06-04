"use client";

import type { AssessmentInput } from "../../data/fitnessAssessment";
import { getPrimaryNextMilestone } from "../../data/physicalMilestones";
import type { PathMode } from "../../data/pathMode";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  input: AssessmentInput | null;
  pathMode?: PathMode | null;
  emphasis?: "physical" | "balanced" | "habits";
};

export default function NextMilestoneBlock({
  input,
  pathMode,
  emphasis = "balanced",
}: Props) {
  const { t } = useTranslation();

  if (!input) return null;

  const primary = getPrimaryNextMilestone(input);
  if (!primary || primary.nextRung === null) {
    return (
      <div className="iron-card-accent p-3 border border-iron-accent-dim/40 rounded-sm">
        <p className="iron-label">{t("coaching.nextGoal.title")}</p>
        <p className="text-sm text-iron-text mt-2">{t("coaching.nextGoal.maxed")}</p>
      </div>
    );
  }

  const goalText = t("coaching.nextGoal.line", {
    value: primary.nextRung,
    unit: t(primary.i18nUnit),
    metric: t(primary.i18nLabel),
  });

  const showHabitsNote =
    pathMode === "self_development" || emphasis === "habits";
  const prominent =
    pathMode === "sport" || emphasis === "physical";

  return (
    <div
      className={`p-3 rounded-sm border ${
        prominent
          ? "iron-card-accent border-iron-accent-dim/50"
          : "iron-card-raised border-iron-border"
      }`}
    >
      <p className="iron-label">{t("coaching.nextGoal.title")}</p>
      <p className={`mt-1 font-semibold text-iron-text ${prominent ? "text-base" : "text-sm"}`}>
        {goalText}
      </p>
      <div className="w-full h-1.5 iron-progress-track mt-2 overflow-hidden rounded-sm">
        <div
          className="h-full iron-progress-fill"
          style={{ width: `${primary.progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-iron-muted mt-1">
        {t("coaching.nextGoal.progress", { percent: primary.progressPercent })}
      </p>
      {showHabitsNote && pathMode === "self_development" && (
        <p className="text-xs text-iron-muted mt-2">{t("coaching.nextGoal.habitsNote")}</p>
      )}
      {pathMode === "balance" && (
        <p className="text-xs text-iron-muted mt-2">{t("coaching.nextGoal.balanceNote")}</p>
      )}
    </div>
  );
}
