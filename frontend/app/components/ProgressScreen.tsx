"use client";

import type { AchievementId } from "../data/achievements";
import { translateGoal, translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import type { SeasonRecord } from "../hooks/useSeasons";
import type { AchievementProgressInput } from "../utils/achievementProgress";
import ScreenShell from "./ScreenShell";
import WeightProgressScreen from "./WeightProgressScreen";
import ProgressSectionHeading from "./progress/ProgressSectionHeading";
import ProgressStrengthSection from "./progress/ProgressStrengthSection";
import ProgressAchievementsSection from "./progress/ProgressAchievementsSection";
import ProgressSeasonsSection from "./progress/ProgressSeasonsSection";

type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  xp: number;
  maxXp: number;
  goal: string;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  highestLevel: number;
  workoutCount: number;
  missionsCompleted: number;
  daysSinceStart: number;
  achievementsUnlocked: AchievementId[];
  progressInput: AchievementProgressInput;
  seasons: SeasonRecord[];
  onBack: () => void;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center border-b border-iron-border pb-2 last:border-0 last:pb-0">
      <span className="uppercase text-xs font-bold text-iron-muted">{label}</span>
      <span className="font-black text-iron-cream">{value}</span>
    </div>
  );
}

export default function ProgressScreen({
  level,
  rank,
  week,
  phase,
  xp,
  maxXp,
  goal,
  currentStreak,
  longestStreak,
  totalXp,
  highestLevel,
  workoutCount,
  missionsCompleted,
  daysSinceStart,
  achievementsUnlocked,
  progressInput,
  seasons,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const pathProgress = (week / 24) * 100;
  const xpProgress = maxXp > 0 ? (xp / maxXp) * 100 : 0;
  const phaseLabel = translatePhase(phase, t);
  const goalLabel = translateGoal(goal, t);

  return (
    <ScreenShell
      eyebrow={t("progressScreen.eyebrow")}
      title={t("progressScreen.title")}
      subtitle={t("progressScreen.subtitle")}
      onBack={onBack}
    >
      <ProgressSectionHeading title={t("progressScreen.sectionGeneral")} />

      <div className="grid grid-cols-2 gap-4">
        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">
            {t("progressScreen.level")}
          </p>
          <p className="text-4xl font-black text-iron-text">{level}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">{rank}</p>
        </div>

        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">
            {t("progressScreen.week")}
          </p>
          <p className="text-4xl font-black text-iron-text">{week}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">
            {t("progressScreen.weekOf")}
          </p>
        </div>
      </div>

      <div className="iron-card-raised p-4 mt-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>{t("progressScreen.xpProgress")}</span>
          <span className="text-iron-muted">
            {xp} / {maxXp}
          </span>
        </div>
        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="iron-card-panel p-4 mt-4 space-y-2">
        <StatRow
          label={t("progressScreen.streakCurrent")}
          value={t("statsScreen.streakDays", { count: currentStreak })}
        />
        <StatRow
          label={t("progressScreen.streakLongest")}
          value={t("statsScreen.streakDays", { count: longestStreak })}
        />
        <StatRow label={t("progressScreen.currentPhase")} value={phaseLabel} />
        <StatRow label={t("progressScreen.goal")} value={goalLabel} />
      </div>

      <div className="iron-card-raised p-4 mt-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>{t("progressScreen.path24")}</span>
          <span className="text-iron-gold">{Math.round(pathProgress)}%</span>
        </div>
        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${pathProgress}%` }}
          />
        </div>
      </div>

      <div className="iron-card-panel p-4 mt-4 space-y-2">
        <StatRow label={t("statsScreen.totalXp")} value={totalXp.toLocaleString()} />
        <StatRow label={t("statsScreen.workoutsCompleted")} value={workoutCount} />
        <StatRow label={t("statsScreen.missionsCompleted")} value={missionsCompleted} />
        <StatRow label={t("statsScreen.highestLevel")} value={highestLevel} />
        <StatRow label={t("statsScreen.daysOnPath")} value={daysSinceStart} />
      </div>

      <ProgressSectionHeading
        title={t("progressScreen.sectionStrength")}
        subtitle={t("progressScreen.sectionStrengthHint")}
      />
      <ProgressStrengthSection />

      <ProgressSectionHeading title={t("progressScreen.sectionWeight")} />
      <WeightProgressScreen />

      <ProgressSectionHeading title={t("progressScreen.sectionAchievements")} />
      <ProgressAchievementsSection
        achievementsUnlocked={achievementsUnlocked}
        progressInput={progressInput}
      />

      <ProgressSectionHeading title={t("progressScreen.sectionSeasons")} />
      <ProgressSeasonsSection seasons={seasons} />
    </ScreenShell>
  );
}
