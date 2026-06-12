"use client";

import type { MilestoneProgress } from "../../data/physicalMilestones";
import {
  formatTrackMetricValue,
  getTrackTitleKey,
} from "../../data/physicalMilestones";
import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  track: MilestoneProgress;
  compact?: boolean;
};

export default function PhysicalTrackGoalCard({ track, compact = false }: Props) {
  const { t, locale } = useTranslation();
  const lang = locale === "ru" ? "ru" : "en";
  const title = t(getTrackTitleKey(track));
  const nowValue = formatTrackMetricValue(track, track.current, lang);
  const goalValue =
    track.nextRung !== null
      ? formatTrackMetricValue(track, track.nextRung, lang)
      : t("coaching.milestones.goalComplete");

  return (
    <div
      className={`border border-iron-border iron-card-panel rounded-sm ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className={`font-bold text-iron-text ${compact ? "text-xs" : "text-sm"}`}>
        {title}
      </p>

      <div className={`grid grid-cols-2 gap-3 ${compact ? "mt-2" : "mt-3"}`}>
        <div className="border border-iron-border/70 rounded-sm p-2.5 bg-iron-panel/60">
          <p className="text-[10px] uppercase tracking-widest text-iron-muted font-semibold">
            {t("coaching.milestones.now")}
          </p>
          <p className={`font-semibold text-iron-text mt-1 ${compact ? "text-sm" : "text-base"}`}>
            {nowValue}
          </p>
        </div>
        <div className="border border-iron-accent-dim/40 rounded-sm p-2.5 bg-iron-accent/5">
          <p className="text-[10px] uppercase tracking-widest text-iron-accent font-semibold">
            {t("coaching.milestones.goal")}
          </p>
          <p className={`font-semibold text-iron-text mt-1 ${compact ? "text-sm" : "text-base"}`}>
            {goalValue}
          </p>
        </div>
      </div>

      {track.nextRung !== null && track.cardioMode !== "skipped" && (
        <div className="w-full h-1.5 iron-progress-track mt-3 overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={track.progressPercent} />
        </div>
      )}
    </div>
  );
}
