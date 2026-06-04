"use client";

import { useState } from "react";
import { translateBossRewardTitleById } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  streak: number;
  body: number;
  mind: number;
  work: number;
  equippedTitle?: string | null;
};

export default function ShareProgressCard(props: Props) {
  const { t } = useTranslation();
  const { level, rank, week, phase, streak, body, mind, work, equippedTitle } = props;
  const [copied, setCopied] = useState(false);
  const titleLabel = translateBossRewardTitleById(equippedTitle, t);

  const buildShareText = () => {
    const titleLine = equippedTitle ? titleLabel ?? equippedTitle : null;

    return [
      t("app.title").toUpperCase(),
      titleLine ? `"${titleLine}"` : null,
      `${t("share.level")} ${level} — ${rank}`,
      `${t("share.week")} ${week}/24 · ${phase}`,
      `${t("share.streak")}: ${t("share.streakDays", { count: streak })}`,
      `${t("stat.body")} ${body} · ${t("stat.mind")} ${mind} · ${t("stat.work")} ${work}`,
      "",
      t("share.stayOnPath"),
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: t("app.title"),
          text,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const rowClass = "flex justify-between border border-iron-border px-4 py-3";

  return (
    <div className="border border-iron-border-strong iron-card-panel p-5">
      <div className="text-center border-b border-iron-border pb-4">
        <h3 className="iron-heading text-2xl tracking-wide">{t("app.title")}</h3>
        <p className="text-xs mt-2 iron-page-header-sub">{t("app.tagline")}</p>
      </div>

      <div className="mt-4 space-y-3 text-sm font-semibold">
        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>{t("share.level")}</span>
          <span>{level}</span>
        </div>

        <div className={`${rowClass} iron-card-panel text-iron-text`}>
          <span>{t("share.rank")}</span>
          <span>{rank}</span>
        </div>

        {titleLabel && (
          <div className="border border-iron-accent-dim px-4 py-3 bg-iron-panel text-center">
            <p className="text-xs text-iron-muted">{t("share.title")}</p>
            <p className="font-semibold mt-1">{titleLabel}</p>
          </div>
        )}

        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>{t("share.week")}</span>
          <span>
            {week} / 24
          </span>
        </div>

        <div className="border border-iron-border px-4 py-3 iron-card-panel text-center">
          <p className="text-xs text-iron-accent">{t("share.currentPhase")}</p>
          <p className="font-semibold mt-1">{phase}</p>
        </div>

        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>{t("share.streak")}</span>
          <span>{t("share.streakDays", { count: streak })}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-accent">{t("stat.body")}</p>
            <p className="text-2xl font-semibold mt-1">{body}</p>
          </div>
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-accent">{t("stat.mind")}</p>
            <p className="text-2xl font-semibold mt-1">{mind}</p>
          </div>
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-accent">{t("stat.work")}</p>
            <p className="text-2xl font-semibold mt-1">{work}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="w-full mt-5 iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
      >
        {copied ? t("share.copied") : t("share.shareProgress")}
      </button>
    </div>
  );
}
