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

  return (
    <div className="border-4 border-black bg-[#e8d8b0] p-5">
      <div className="text-center border-b-4 border-black pb-4">
        <h3 className="text-3xl font-black tracking-wide">IRON PATH</h3>
        <p className="text-xs mt-1 uppercase tracking-[0.2em]">Est. 1950</p>
      </div>

      <div className="mt-4 space-y-3 uppercase text-sm font-bold">
        <div className="flex justify-between border-2 border-black px-4 py-3 bg-[#f5ead0]">
          <span>Level</span>
          <span className="font-black">{level}</span>
        </div>

        <div className="flex justify-between border-2 border-black px-4 py-3 bg-black text-[#efe3c2]">
          <span>Rank</span>
          <span className="font-black">{rank}</span>
        </div>

        {titleLabel && (
          <div className="border-2 border-black px-4 py-3 bg-[#b22222] text-[#efe3c2] text-center">
            <p className="text-xs tracking-widest">Title</p>
            <p className="font-black mt-1">{titleLabel}</p>
          </div>
        )}

        <div className="flex justify-between border-2 border-black px-4 py-3 bg-[#f5ead0]">
          <span>Week</span>
          <span className="font-black">
            {week} / 24
          </span>
        </div>

        <div className="border-2 border-black px-4 py-3 bg-black text-[#efe3c2] text-center">
          <p className="text-xs tracking-widest">Current Phase</p>
          <p className="font-black mt-1">{phase}</p>
        </div>

        <div className="flex justify-between border-2 border-black px-4 py-3 bg-[#f5ead0]">
          <span>Streak</span>
          <span className="font-black">{streak} days</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border-2 border-black p-3 bg-[#f5ead0]">
            <p className="text-xs">Body</p>
            <p className="text-2xl font-black mt-1">{body}</p>
          </div>
          <div className="border-2 border-black p-3 bg-[#f5ead0]">
            <p className="text-xs">Mind</p>
            <p className="text-2xl font-black mt-1">{mind}</p>
          </div>
          <div className="border-2 border-black p-3 bg-[#f5ead0]">
            <p className="text-xs">Work</p>
            <p className="text-2xl font-black mt-1">{work}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="w-full mt-5 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
      >
        {copied ? "Copied to Clipboard" : "Share Progress"}
      </button>
    </div>
  );
}
