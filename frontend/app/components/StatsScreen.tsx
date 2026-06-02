"use client";

import { getTitleLabel } from "../data/bosses";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  totalXp: number;
  level: number;
  highestLevel: number;
  workoutCount: number;
  missionsCompleted: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  seasonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceStart: number;
  equippedTitle: string | null;
  bossesDefeated: number;
  bossesTotal: number;
  bossCompletionPercent: number;
  onBack: () => void;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center border-b border-iron-border pb-3 last:border-0 last:pb-0">
      <span className="uppercase text-xs sm:text-sm font-bold text-iron-muted">
        {label}
      </span>
      <span className="font-black text-lg text-iron-cream">{value}</span>
    </div>
  );
}

export default function StatsScreen({
  totalXp,
  level,
  highestLevel,
  workoutCount,
  missionsCompleted,
  achievementsUnlocked,
  achievementsTotal,
  seasonsCompleted,
  currentStreak,
  longestStreak,
  daysSinceStart,
  equippedTitle,
  bossesDefeated,
  bossesTotal,
  bossCompletionPercent,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const titleLabel = getTitleLabel(equippedTitle);

  return (
    <ScreenShell
      eyebrow={t("statsScreen.eyebrow")}
      title={t("statsScreen.title")}
      subtitle={t("statsScreen.subtitle")}
      onBack={onBack}
    >
      <IronCard variant="dark">
        <div className="space-y-3">
          <StatRow
            label={t("statsScreen.currentTitle")}
            value={titleLabel ?? t("common.none")}
          />
          <StatRow
            label={t("statsScreen.bossesDefeated")}
            value={`${bossesDefeated} / ${bossesTotal}`}
          />
          <StatRow
            label={t("statsScreen.bossCompletion")}
            value={`${bossCompletionPercent}%`}
          />
        </div>
      </IronCard>

      <IronCard variant="dark">
        <div className="space-y-3">
          <StatRow
            label={t("statsScreen.totalXp")}
            value={totalXp.toLocaleString()}
          />
          <StatRow label={t("statsScreen.currentLevel")} value={level} />
          <StatRow label={t("statsScreen.highestLevel")} value={highestLevel} />
          <StatRow
            label={t("statsScreen.workoutsCompleted")}
            value={workoutCount}
          />
          <StatRow
            label={t("statsScreen.missionsCompleted")}
            value={missionsCompleted}
          />
          <StatRow
            label={t("statsScreen.achievements")}
            value={`${achievementsUnlocked} / ${achievementsTotal}`}
          />
          <StatRow
            label={t("statsScreen.seasonsCompleted")}
            value={seasonsCompleted}
          />
          <StatRow
            label={t("statsScreen.currentStreak")}
            value={t("statsScreen.streakDays", { count: currentStreak })}
          />
          <StatRow
            label={t("statsScreen.longestStreak")}
            value={t("statsScreen.streakDays", { count: longestStreak })}
          />
          <StatRow label={t("statsScreen.daysOnPath")} value={daysSinceStart} />
        </div>
      </IronCard>
    </ScreenShell>
  );
}
