"use client";

import { useState } from "react";
import { getTitleLabel } from "../data/bosses";

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

function buildShareText({
  level,
  rank,
  week,
  phase,
  streak,
  body,
  mind,
  work,
  equippedTitle,
}: Props) {
  const titleLine = equippedTitle
    ? getTitleLabel(equippedTitle) ?? equippedTitle
    : null;

  return [
    "IRON PATH",
    titleLine ? `"${titleLine}"` : null,
    `Level ${level} — ${rank}`,
    `Week ${week}/24 · ${phase}`,
    `Streak: ${streak} days`,
    `Body ${body} · Mind ${mind} · Work ${work}`,
    "",
    "Stay on the path.",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function ShareProgressCard(props: Props) {
  const { level, rank, week, phase, streak, body, mind, work, equippedTitle } =
    props;
  const [copied, setCopied] = useState(false);
  const titleLabel = getTitleLabel(equippedTitle);

  const handleShare = async () => {
    const text = buildShareText(props);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "IRON PATH",
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
        <h3 className="text-3xl font-black tracking-wide text-iron-text">IRON PATH</h3>
        <p className="text-xs mt-1 uppercase tracking-[0.2em] text-iron-gold">Est. 1950</p>
      </div>

      <div className="mt-4 space-y-3 uppercase text-sm font-bold">
        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>Level</span>
          <span className="font-black">{level}</span>
        </div>

        <div className={`${rowClass} iron-card-panel text-iron-cream`}>
          <span>Rank</span>
          <span className="font-black">{rank}</span>
        </div>

        {titleLabel && (
          <div className="border border-iron-accent-dim px-4 py-3 bg-iron-panel text-center">
            <p className="text-xs tracking-widest">Title</p>
            <p className="font-black mt-1">{titleLabel}</p>
          </div>
        )}

        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>Week</span>
          <span className="font-black">
            {week} / 24
          </span>
        </div>

        <div className="border border-iron-border px-4 py-3 iron-card-panel text-iron-cream text-center">
          <p className="text-xs tracking-widest text-iron-gold">Current Phase</p>
          <p className="font-black mt-1">{phase}</p>
        </div>

        <div className={`${rowClass} iron-card-raised text-iron-text`}>
          <span>Streak</span>
          <span className="font-black">{streak} days</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-gold">Body</p>
            <p className="text-2xl font-black mt-1">{body}</p>
          </div>
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-gold">Mind</p>
            <p className="text-2xl font-black mt-1">{mind}</p>
          </div>
          <div className="border border-iron-border p-3 iron-card-raised text-iron-text">
            <p className="text-xs text-iron-gold">Work</p>
            <p className="text-2xl font-black mt-1">{work}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="w-full mt-5 iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
      >
        {copied ? "Copied to Clipboard" : "Share Progress"}
      </button>
    </div>
  );
}
