"use client";

import type { AchievementId } from "../data/achievements";
import { useTranslation } from "../i18n/useTranslation";
import type { SeasonRecord } from "../hooks/useSeasons";
import type { AchievementProgressInput } from "../utils/achievementProgress";
import ScreenShell from "./ScreenShell";
import Stagger from "../animations/Stagger";
import WeightProgressScreen from "./WeightProgressScreen";
import ProgressOverviewSection from "./progress/ProgressOverviewSection";
import ProgressStrengthSection from "./progress/ProgressStrengthSection";
import ProgressAchievementsDashboard from "./progress/ProgressAchievementsDashboard";
import ProgressSeasonsSection from "./progress/ProgressSeasonsSection";
import ProgressPhysicalMilestonesSection from "./progress/ProgressPhysicalMilestonesSection";
import ProgressCollapsibleSection from "./ui/ProgressCollapsibleSection";

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

export default function ProgressScreen({
  level,
  rank,
  week,
  phase,
  xp,
  maxXp,
  goal,
  currentStreak,
  longestStreak: _longestStreak,
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

  return (
    <ScreenShell
      eyebrow={t("progressScreen.eyebrow")}
      title={t("progressScreen.title")}
      subtitle={t("progressScreen.subtitle")}
      onBack={onBack}
    >
      <Stagger className="space-y-3">
        <div className="iron-card-panel p-4">
          <p className="text-xs uppercase font-bold text-iron-gold">
            {t("progressScreen.summaryTitle")}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-xs text-iron-muted uppercase">{t("progressScreen.level")}</p>
              <p className="text-2xl font-black text-iron-cream">
                {level}
                <span className="text-sm text-iron-muted ml-1">{rank}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-iron-muted uppercase">{t("progressScreen.week")}</p>
              <p className="text-2xl font-black text-iron-cream">
                {week}
                <span className="text-sm text-iron-muted">{t("progressScreen.weekOf")}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-iron-muted uppercase">
                {t("progressScreen.summaryWorkouts")}
              </p>
              <p className="text-2xl font-black text-iron-cream">{workoutCount}</p>
            </div>
            <div>
              <p className="text-xs text-iron-muted uppercase">
                {t("progressScreen.summaryStreak")}
              </p>
              <p className="text-2xl font-black text-iron-cream">
                {t("statsScreen.streakDays", { count: currentStreak })}
              </p>
            </div>
          </div>
        </div>

        <ProgressCollapsibleSection
          title={t("progressScreen.tabPhysical")}
          defaultOpen
        >
          <ProgressPhysicalMilestonesSection />
        </ProgressCollapsibleSection>

        <ProgressCollapsibleSection
          title={t("progressScreen.sectionGeneral")}
          hint={t("progressScreen.tabOverview")}
        >
          <ProgressOverviewSection
            level={level}
            rank={rank}
            week={week}
            phase={phase}
            xp={xp}
            maxXp={maxXp}
            goal={goal}
            totalXp={totalXp}
            workoutCount={workoutCount}
            missionsCompleted={missionsCompleted}
            highestLevel={highestLevel}
            daysSinceStart={daysSinceStart}
          />
        </ProgressCollapsibleSection>

        <ProgressCollapsibleSection
          title={t("progressScreen.sectionStrength")}
          hint={t("progressScreen.sectionStrengthHint")}
        >
          <ProgressStrengthSection />
        </ProgressCollapsibleSection>

        <ProgressCollapsibleSection
          title={t("progressScreen.sectionWeight")}
        >
          <WeightProgressScreen compact />
        </ProgressCollapsibleSection>

        <ProgressCollapsibleSection
          title={t("progressScreen.sectionAchievements")}
        >
          <ProgressAchievementsDashboard
            achievementsUnlocked={achievementsUnlocked}
            progressInput={progressInput}
          />
        </ProgressCollapsibleSection>

        <ProgressCollapsibleSection
          title={t("progressScreen.sectionSeasons")}
        >
          <ProgressSeasonsSection seasons={seasons} />
        </ProgressCollapsibleSection>
      </Stagger>
    </ScreenShell>
  );
}
