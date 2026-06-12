"use client";

import type { AssessmentInput } from "../../data/fitnessAssessment";
import { getHeroMilestoneGoals } from "../../data/physicalMilestones";
import type { PathMode } from "../../data/pathMode";
import PhysicalTrackGoalCard from "../progress/PhysicalTrackGoalCard";
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
      className={`p-3 rounded-sm border space-y-3 ${
        prominent
          ? "iron-card-accent border-iron-accent-dim/50"
          : "iron-card-raised border-iron-border"
      }`}
    >
      <p className="iron-label">{t("coaching.nextGoal.title")}</p>
      {goals.map((goal) => (
        <PhysicalTrackGoalCard key={goal.id} track={goal} compact />
      ))}
      {showHabitsNote && pathMode === "self_development" && (
        <p className="text-xs text-iron-muted">{t("coaching.nextGoal.habitsNote")}</p>
      )}
      {pathMode === "balance" && (
        <p className="text-xs text-iron-muted">{t("coaching.nextGoal.balanceNote")}</p>
      )}
    </div>
  );
}
