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
import RankAvatar from "./RankAvatar";

type Props = {
  profile: Profile;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  titleLabel?: string | null;
  pathModeLabel?: string;
  body?: number;
  mind?: number;
  work?: number;
  week?: number;
  showStats?: boolean;
};

function streakClass(streak: number): string {
  if (streak > 30) return "iron-profile-streak iron-profile-streak--legend";
  if (streak > 7) return "iron-profile-streak iron-profile-streak--glow";
  return "iron-profile-streak";
}

export default function PlayerProfileCard({
  profile,
  level,
  xp,
  maxXp,
  streak,
  titleLabel,
  pathModeLabel,
  body,
  mind,
  work,
  week,
  showStats = true,
}: Props) {
  const { t } = useTranslation();
  const telegramUser = useTelegramUser();
  const profileTitle = telegramUser.isTelegramUser
    ? telegramUser.displayName
    : t("hero.profileLabel");

  const currentRankId = getPlayerRank(level);
  const nextRankId = getNextPlayerRank(level);
  const currentRank = translatePlayerRank(currentRankId, t);
  const nextRank = nextRankId ? translatePlayerRank(nextRankId, t) : null;
  const xpToNextRank = getXpToNextRank(level, xp, maxXp);

  return (
    <section className="space-y-3 border-b border-iron-border pb-3">
      <div className="flex gap-3 items-center">
        <RankAvatar
          level={level}
          avatarId={profile.avatarId}
          className="w-16 h-20 sm:w-[4.5rem] sm:h-[5.5rem] object-cover iron-avatar-frame shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="iron-label truncate">{profileTitle}</p>
          <h2 className="iron-heading text-xl sm:text-2xl mt-0.5">
            {currentRank}
          </h2>
          <p className="text-sm text-iron-muted mt-0.5">
            {t("playerRank.levelLabel", { level })}
          </p>
          {titleLabel && (
            <p className="text-sm text-iron-accent mt-0.5 truncate">{titleLabel}</p>
          )}
          {pathModeLabel && (
            <p className="text-sm text-iron-muted mt-0.5">
              {t("hero.pathModeLine", { mode: pathModeLabel })}
            </p>
          )}
        </div>
      </div>

      <div className={streakClass(streak)}>
        <span aria-hidden="true">🔥</span>
        <span>{t("playerRank.streak", { streak })}</span>
        {streak > 30 && (
          <span className="iron-profile-streak-badge">{t("playerRank.streakBadge")}</span>
        )}
      </div>

      {showStats && body !== undefined && mind !== undefined && work !== undefined && (
        <p className="text-sm text-iron-muted">
          {t("hero.classStats", {
            bodyLabel: t("stat.body"),
            body,
            mindLabel: t("stat.mind"),
            mind,
            workLabel: t("stat.work"),
            work,
          })}
        </p>
      )}

      {week !== undefined && (
        <p className="text-xs text-iron-muted">
          {t("hero.streakWeek", { streak, week })}
        </p>
      )}

      <div className="iron-card-panel p-3 space-y-1.5">
        <p className="text-xs text-iron-muted">
          {t("playerRank.currentRank", { rank: currentRank })}
        </p>
        {nextRank ? (
          <>
            <p className="text-sm text-iron-text">
              {t("playerRank.nextRank", { rank: nextRank })}
            </p>
            <p className="text-sm font-semibold text-iron-accent">
              {t("playerRank.xpToNextRank", { xp: xpToNextRank })}
            </p>
          </>
        ) : (
          <p className="text-sm text-iron-muted">{t("playerRank.maxRank")}</p>
        )}
      </div>
    </section>
  );
}
