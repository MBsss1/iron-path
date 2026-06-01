"use client";

import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  type AchievementId,
} from "../data/achievements";
import {
  formatCategoryLabel,
  getAchievementProgress,
  type AchievementProgressInput,
} from "../utils/achievementProgress";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  achievementsUnlocked: AchievementId[];
  progressInput: AchievementProgressInput;
};

export default function AchievementsScreen({
  achievementsUnlocked,
  progressInput,
}: Props) {
  const unlockedCount = achievementsUnlocked.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <ScreenShell
      eyebrow="Path Milestones"
      title="Achievements"
      subtitle={`${unlockedCount} / ${totalCount} unlocked · ${completionPercent}% complete`}
    >
      <IronCard variant="dark">
        <p className="uppercase text-xs font-bold text-center">Completion</p>
        <p className="text-4xl font-black text-center mt-1">{completionPercent}%</p>
        <div className="w-full h-4 border-2 border-[#efe3c2] mt-4">
          <div
            className="h-full bg-[#b22222] transition-all duration-500"
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
            <h3 className="text-xl font-black uppercase mb-3">
              {formatCategoryLabel(category)}
            </h3>

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
                        <h4 className="text-base sm:text-lg font-black uppercase">
                          {achievement.title}
                        </h4>
                        <p className="text-xs sm:text-sm mt-1 uppercase leading-relaxed">
                          {isUnlocked
                            ? achievement.description
                            : achievement.hint}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 border-2 border-black text-[10px] sm:text-xs font-black uppercase ${
                          isUnlocked
                            ? "bg-[#b22222] text-[#efe3c2]"
                            : "bg-gray-400 text-gray-700"
                        }`}
                      >
                        {isUnlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    {!isUnlocked && (
                      <div className="mt-4">
                        <div className="flex justify-between uppercase text-xs font-bold">
                          <span>Progress</span>
                          <span>
                            {current} / {target}
                          </span>
                        </div>
                        <div className="w-full h-3 border-2 border-black mt-2 bg-[#f5ead0]">
                          <div
                            className="h-full bg-[#b22222] transition-all duration-500"
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
    </ScreenShell>
  );
}
