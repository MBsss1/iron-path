"use client";

import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  type AchievementId,
} from "../../data/achievements";
import {
  translateAchievement,
  translateAchievementCategory,
} from "../../i18n/labels";
import { useTranslation } from "../../i18n/useTranslation";
import {
  getAchievementProgress,
  type AchievementProgressInput,
} from "../../utils/achievementProgress";
import IronCard from "../IronCard";

type Props = {
  achievementsUnlocked: AchievementId[];
  progressInput: AchievementProgressInput;
};

export default function ProgressAchievementsSection({
  achievementsUnlocked,
  progressInput,
}: Props) {
  const { t } = useTranslation();
  const unlockedCount = achievementsUnlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

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
        <div className="w-full h-4 iron-progress-track mt-4 overflow-hidden">
          <div
            className="h-full iron-progress-fill transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </IronCard>

      {ACHIEVEMENT_CATEGORIES.map((category) => {
        const items = ACHIEVEMENTS.filter(
          (achievement) => achievement.category === category
        );

        if (items.length === 0) return null;

        return (
          <div key={category}>
            <h4 className="text-sm font-black uppercase mb-3 text-iron-text">
              {translateAchievementCategory(category, t)}
            </h4>

            <div className="space-y-3">
              {items.map((achievement) => {
                const isUnlocked = achievementsUnlocked.includes(achievement.id);
                const { current, target, percent } = getAchievementProgress(
                  achievement,
                  progressInput
                );

                return (
                  <IronCard
                    key={achievement.id}
                    variant={isUnlocked ? "tan" : "paper"}
                    className={isUnlocked ? "" : "opacity-90"}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-black uppercase">
                          {translateAchievement(
                            achievement.id,
                            "title",
                            achievement.title,
                            t
                          )}
                        </h5>
                        <p className="text-xs mt-1 uppercase leading-relaxed">
                          {isUnlocked
                            ? translateAchievement(
                                achievement.id,
                                "description",
                                achievement.description,
                                t
                              )
                            : translateAchievement(
                                achievement.id,
                                "hint",
                                achievement.hint,
                                t
                              )}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 border border-iron-border text-[10px] font-black uppercase ${
                          isUnlocked
                            ? "bg-iron-accent-dim text-iron-bg"
                            : "bg-iron-charcoal text-iron-muted"
                        }`}
                      >
                        {isUnlocked ? t("common.unlocked") : t("common.locked")}
                      </span>
                    </div>

                    {!isUnlocked && (
                      <div className="mt-3">
                        <div className="flex justify-between uppercase text-xs font-bold">
                          <span>{t("common.progress")}</span>
                          <span>
                            {current} / {target}
                          </span>
                        </div>
                        <div className="w-full h-2 iron-progress-track mt-2 overflow-hidden">
                          <div
                            className="h-full iron-progress-fill transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </IronCard>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
