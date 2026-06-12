"use client";

import { useMemo, useState } from "react";
import {
  ACHIEVEMENTS,
  type AchievementId,
} from "../../data/achievements";
import { translateAchievement } from "../../i18n/labels";
import { useTranslation } from "../../i18n/useTranslation";
import {
  getAchievementProgress,
  type AchievementProgressInput,
} from "../../utils/achievementProgress";
import IronCard from "../IronCard";
import ProgressAchievementsSection from "./ProgressAchievementsSection";

type Props = {
  achievementsUnlocked: AchievementId[];
  progressInput: AchievementProgressInput;
};

export default function ProgressAchievementsDashboard({
  achievementsUnlocked,
  progressInput,
}: Props) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const unlockedCount = achievementsUnlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const recentUnlocked = useMemo(() => {
    return [...achievementsUnlocked]
      .slice(-3)
      .reverse()
      .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
      .filter(Boolean);
  }, [achievementsUnlocked]);

  const upNext = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => !achievementsUnlocked.includes(a.id))
      .map((achievement) => ({
        achievement,
        ...getAchievementProgress(achievement, progressInput),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  }, [achievementsUnlocked, progressInput]);

  if (showAll) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="text-sm text-iron-accent-dim font-semibold"
        >
          ← {t("common.back")}
        </button>
        <ProgressAchievementsSection
          achievementsUnlocked={achievementsUnlocked}
          progressInput={progressInput}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <IronCard variant="dark">
        <p className="uppercase text-xs font-bold text-center">
          {t("achievementsScreen.completion")}
        </p>
        <p className="text-3xl font-black text-center mt-1">{completionPercent}%</p>
        <p className="text-xs text-center text-iron-muted mt-1 uppercase">
          {t("achievementsScreen.subtitle", {
            unlocked: unlockedCount,
            total: totalCount,
            percent: completionPercent,
          })}
        </p>
      </IronCard>

      <div>
        <h4 className="text-sm font-black uppercase text-iron-gold mb-2">
          {t("progressScreen.achievementsRecent")}
        </h4>
        {recentUnlocked.length === 0 ? (
          <p className="text-sm text-iron-muted">{t("progressScreen.achievementsNoneRecent")}</p>
        ) : (
          <ul className="space-y-2">
            {recentUnlocked.map((achievement) => (
              <li
                key={achievement!.id}
                className="border border-iron-border p-3 iron-card-raised text-sm font-semibold"
              >
                {translateAchievement(
                  achievement!.id,
                  "title",
                  achievement!.title,
                  t
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="text-sm font-black uppercase text-iron-gold mb-2">
          {t("progressScreen.achievementsUpNext")}
        </h4>
        {upNext.length === 0 ? (
          <p className="text-sm text-iron-muted">{t("progressScreen.achievementsNoneUpNext")}</p>
        ) : (
          <ul className="space-y-3">
            {upNext.map(({ achievement, current, target, percent }) => (
              <li key={achievement.id} className="border border-iron-border p-3 iron-card-panel">
                <p className="text-sm font-bold uppercase">
                  {translateAchievement(
                    achievement.id,
                    "title",
                    achievement.title,
                    t
                  )}
                </p>
                <p className="text-xs text-iron-muted mt-1">
                  {translateAchievement(achievement.id, "hint", achievement.hint, t)}
                </p>
                <div className="flex justify-between text-xs font-bold mt-2">
                  <span>{t("common.progress")}</span>
                  <span>
                    {current} / {target}
                  </span>
                </div>
                <div className="w-full h-2 iron-progress-track mt-1 overflow-hidden">
                  <div
                    className="h-full iron-progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowAll(true)}
        className="w-full iron-interactive border border-iron-border py-3 text-sm font-semibold uppercase rounded-sm"
      >
        {t("progressScreen.achievementsViewAll")}
      </button>
    </div>
  );
}
