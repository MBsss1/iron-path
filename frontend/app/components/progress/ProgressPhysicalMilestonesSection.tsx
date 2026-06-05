"use client";

import {
  formatMilestoneGoalText,
  getGoalOrderedMilestones,
} from "../../data/physicalMilestones";
import { useFitnessAssessment } from "../../hooks/useFitnessAssessment";
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
        <div
          key={track.id}
          className="border border-iron-border iron-card-panel p-4 rounded-sm"
        >
          <div className="flex justify-between items-baseline gap-2">
            <p className="font-bold text-sm text-iron-text">
              {track.id === "running" && track.cardioMode === "walk"
                ? t("coaching.milestone.walking")
                : t(track.i18nLabel)}
            </p>
            <p className="text-xs text-iron-muted">
              {track.cardioMode === "skipped"
                ? t("coaching.milestones.skippedLine")
                : `${track.current} ${t(track.i18nUnit)}`}
            </p>
          </div>
          {track.nextRung !== null ? (
            <>
              {track.cardioMode !== "skipped" && (
                <p className="text-xs text-iron-accent mt-1">
                  {t("coaching.milestones.currentStage", {
                    from: track.previousRung,
                    to: track.nextRung,
                  })}
                </p>
              )}
              <p className="text-xs text-iron-muted mt-2">
                {formatMilestoneGoalText(track, t)}
              </p>
              <div className="w-full h-2 iron-progress-track mt-2 overflow-hidden rounded-sm">
                <div
                  className="h-full iron-progress-fill"
                  style={{ width: `${track.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-iron-gold mt-1">
                {t("coaching.milestones.percentToGoal", {
                  percent: track.progressPercent,
                })}
              </p>
            </>
          ) : (
            <p className="text-xs text-iron-accent mt-2">
              {t("coaching.milestones.stageComplete")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
