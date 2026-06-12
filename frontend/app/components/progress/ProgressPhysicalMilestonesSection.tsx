"use client";

import { getGoalOrderedMilestones } from "../../data/physicalMilestones";
import { useFitnessAssessment } from "../../hooks/useFitnessAssessment";
import PhysicalTrackGoalCard from "./PhysicalTrackGoalCard";
import { useTranslation } from "../../i18n/useTranslation";

export default function ProgressPhysicalMilestonesSection() {
  const { t } = useTranslation();
  const { isComplete, input } = useFitnessAssessment();

  if (!isComplete || !input) {
    return (
      <p className="text-sm text-iron-muted text-center py-6">
        {t("coaching.milestones.needAssessment")}
      </p>
    );
  }

  const tracks = getGoalOrderedMilestones(input);

  return (
    <div className="space-y-4">
      <p className="text-sm text-iron-muted leading-relaxed">
        {t("coaching.milestones.subtitle")}
      </p>
      {tracks.map((track) => (
        <PhysicalTrackGoalCard key={track.id} track={track} />
      ))}
    </div>
  );
}
