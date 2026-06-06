"use client";

import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  rank: string;
  className?: string;
};

export default function PlayerHud({
  level,
  xp,
  maxXp,
  streak,
  rank,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const xpPercent = maxXp > 0 ? Math.min(100, Math.round((xp / maxXp) * 100)) : 0;

  return (
    <header
      className={`iron-player-hud sticky top-0 z-30 -mx-1 px-1 mb-3 ${className}`.trim()}
      aria-label={t("hero.profileLabel")}
    >
      <div className="iron-player-hud-inner">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="iron-player-hud-level">{t("hero.hudLevel", { level })}</span>
            <span className="text-[10px] text-iron-muted tabular-nums truncate">
              {xp}/{maxXp}
            </span>
          </div>
          <div
            className={`iron-player-hud-streak shrink-0 ${streak > 0 ? "iron-streak-active" : ""}`}
            title={t("statsScreen.summaryStreak")}
          >
            <span aria-hidden="true">🔥</span>
            <span className="tabular-nums">{streak}</span>
          </div>
          <p className="iron-player-hud-rank truncate shrink max-w-[38%] text-right">
            {rank}
          </p>
        </div>
        <div className="mt-1.5 w-full h-1 iron-hud-progress-track overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={xpPercent} />
        </div>
      </div>
    </header>
  );
}
