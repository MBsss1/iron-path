"use client";

import type { AssessmentInput } from "../../data/fitnessAssessment";
import {
  formatMilestoneGoalText,
  getHeroMilestoneGoals,
} from "../../data/physicalMilestones";
import type { PathMode } from "../../data/pathMode";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  input: AssessmentInput | null;
  pathMode?: PathMode | null;
  emphasis?: "physical" | "balanced" | "habits";
  maxGoals?: number;
};

export default function NextMilestoneBlock({
  input,
  pathMode,
  emphasis = "balanced",
  maxGoals = 4,
}: Props) {
  const { t } = useTranslation();

  if (!input) return null;

  const goals = getHeroMilestoneGoals(input, maxGoals);

  if (goals.length === 0) {
    return (
      <div className="iron-card-accent p-3 border border-iron-accent-dim/40 rounded-sm">
        <p className="iron-label">{t("coaching.nextGoal.title")}</p>
        <p className="text-sm text-iron-text mt-2">{t("coaching.nextGoal.maxed")}</p>
      </div>
    );
  }

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
      <ul className="mt-2 space-y-3">
        {goals.map((goal) => (
          <li key={goal.id}>
            <p
              className={`font-semibold text-iron-text ${
                prominent ? "text-sm" : "text-xs"
              }`}
            >
              {formatMilestoneGoalText(goal, t)}
            </p>
            <div className="w-full h-1.5 iron-progress-track mt-1.5 overflow-hidden rounded-sm">
              <div
                className="h-full iron-progress-fill"
                style={{ width: `${goal.progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-iron-muted mt-0.5">
              {t("coaching.nextGoal.progress", { percent: goal.progressPercent })}
            </p>
          </li>
        ))}
      </ul>
      {showHabitsNote && pathMode === "self_development" && (
        <p className="text-xs text-iron-muted mt-2">{t("coaching.nextGoal.habitsNote")}</p>
      )}
      {pathMode === "balance" && (
        <p className="text-xs text-iron-muted mt-2">{t("coaching.nextGoal.balanceNote")}</p>
      )}
    </div>
  );
}
