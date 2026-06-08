"use client";

import {
  getNextPlayerRank,
  getPlayerRank,
  getXpToNextRank,
} from "../../data/playerRanks";
import { translatePlayerRank } from "../../i18n/labels";
import { useTranslation } from "../../i18n/useTranslation";
import { useTelegramUser } from "../../hooks/useTelegramUser";
import type { Profile } from "../../hooks/useProfile";
import AnimatedXpBar from "./AnimatedXpBar";
import RankAvatar from "./RankAvatar";

type Props = {
  profile: Profile;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  titleLabel?: string | null;
  pathModeLabel?: string;
};

function streakChipClass(streak: number): string {
  if (streak > 30) return "iron-player-streak-chip iron-player-streak-chip--legend";
  if (streak > 7) return "iron-player-streak-chip iron-player-streak-chip--glow";
  return "iron-player-streak-chip";
}

export default function PlayerProfileCard({
  profile,
  level,
  xp,
  maxXp,
  streak,
  titleLabel,
  pathModeLabel,
}: Props) {
  const { t } = useTranslation();
  const telegramUser = useTelegramUser();
  const profileTitle = telegramUser.displayName;

  const currentRankId = getPlayerRank(level);
  const nextRankId = getNextPlayerRank(level);
  const currentRank = translatePlayerRank(currentRankId, t);
  const nextRank = nextRankId ? translatePlayerRank(nextRankId, t) : null;
  const xpToNextRank = getXpToNextRank(level, xp, maxXp);

  return (
    <section className="iron-player-profile-card">
      <div className="flex gap-3 items-start">
        <RankAvatar
          level={level}
          avatarId={profile.avatarId}
          className="w-14 h-[4.25rem] sm:w-16 sm:h-20 object-cover iron-avatar-frame shrink-0"
        />
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-iron-text truncate leading-tight">
            {profileTitle}
          </p>
          <p className="text-sm text-iron-muted mt-1 leading-snug">
            {t("playerRank.rankLevelLine", {
              rank: currentRank,
              level,
            })}
          </p>
          <span className={streakChipClass(streak)}>
            <span aria-hidden="true">🔥</span>
            <span>{t("playerRank.streak", { streak })}</span>
            {streak > 30 && (
              <span className="iron-player-streak-chip-badge">
                {t("playerRank.streakBadge")}
              </span>
            )}
          </span>
          {titleLabel && (
            <p className="text-xs text-iron-accent mt-1.5 truncate">{titleLabel}</p>
          )}
          {pathModeLabel && (
            <p className="text-xs text-iron-muted mt-1 truncate">
              {t("hero.pathModeLine", { mode: pathModeLabel })}
            </p>
          )}
        </div>
      </div>

      <div className="iron-player-profile-xp mt-3">
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <span className="text-iron-muted font-semibold uppercase tracking-wide">
            {t("playerRank.xpLabel")}
          </span>
          <span className="text-iron-muted tabular-nums shrink-0">
            {t("playerRank.xpRow", { level, xp, maxXp })}
          </span>
        </div>
        <AnimatedXpBar xp={xp} maxXp={maxXp} className="mt-1.5" />
      </div>

      <div className="mt-2.5 text-xs leading-relaxed">
        {nextRank ? (
          <p className="text-iron-muted">
            <span className="text-iron-muted">{t("playerRank.nextRankLabel")}</span>{" "}
            <span className="text-iron-text">
              {t("playerRank.nextRankPreview", {
                rank: nextRank,
                xp: xpToNextRank,
              })}
            </span>
          </p>
        ) : (
          <p className="text-iron-muted">{t("playerRank.maxRank")}</p>
        )}
      </div>
    </section>
  );
}
