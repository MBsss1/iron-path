"use client";

import { useEffect, useState } from "react";
import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

export type CelebrationReward = {
  label: string;
  value: string;
};

type Props = {
  isOpen: boolean;
  variant: "daily" | "workout";
  title: string;
  subtitle: string;
  phrase?: string;
  rewards: CelebrationReward[];
  xpAmount?: number;
  xpProgress?: { current: number; max: number; label?: string };
  closeLabel: string;
  onClose: () => void;
};

export default function CompletionCelebration({
  isOpen,
  variant,
  title,
  subtitle,
  phrase,
  rewards,
  xpAmount,
  xpProgress,
  closeLabel,
  onClose,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [xpVisible, setXpVisible] = useState(reduced);

  useEffect(() => {
    if (!isOpen) {
      setXpVisible(reduced);
      return;
    }
    if (reduced) {
      setXpVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setXpVisible(true), 280);
    return () => window.clearTimeout(timer);
  }, [isOpen, reduced]);

  if (!isOpen) return null;

  const xpPercent =
    xpProgress && xpProgress.max > 0
      ? Math.min(100, Math.round((xpProgress.current / xpProgress.max) * 100))
      : 0;

  return (
    <div
      className={`fixed inset-0 z-[65] flex items-center justify-center p-4 ${
        reduced ? "iron-modal-overlay" : "iron-celebration-overlay"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`iron-celebration-frame w-full max-w-sm ${
          reduced ? "iron-modal animate-modal-enter" : "iron-celebration-panel"
        }`}
      >
        {!reduced && (
          <>
            <span className="iron-celebration-glow" aria-hidden="true" />
            <span className="iron-celebration-particle iron-celebration-particle-a" aria-hidden="true" />
            <span className="iron-celebration-particle iron-celebration-particle-b" aria-hidden="true" />
          </>
        )}

        <div className="relative z-10 p-6">
          <p className="iron-celebration-eyebrow">
            {variant === "workout"
              ? "◆"
              : "✓"}
          </p>

          <h2 className="iron-heading text-2xl text-center mt-2">{title}</h2>
          <p className="text-sm text-iron-muted text-center mt-2 leading-relaxed">{subtitle}</p>

          {phrase && (
            <p className="text-sm text-iron-accent text-center mt-3 font-semibold italic">
              {phrase}
            </p>
          )}

          {xpAmount !== undefined && (
            <div
              className={`mt-6 text-center ${
                xpVisible ? "iron-celebration-xp-reveal" : "opacity-0"
              }`}
            >
              <p className="text-3xl font-bold iron-text-accent tabular-nums">
                +{xpAmount} XP
              </p>
            </div>
          )}

          {xpProgress && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-iron-muted mb-1.5">
                <span>{xpProgress.label ?? ""}</span>
                <span className="tabular-nums">
                  {xpProgress.current}/{xpProgress.max}
                </span>
              </div>
              <div className="w-full h-2 iron-progress-track overflow-hidden rounded-sm">
                <AnimatedProgressFill percent={xpVisible ? xpPercent : 0} durationMs={900} />
              </div>
            </div>
          )}

          {rewards.length > 0 && (
            <ul className="mt-5 space-y-2 border-t border-iron-border pt-4">
              {rewards.map((reward) => (
                <li
                  key={reward.label}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-iron-muted">{reward.label}</span>
                  <span className="text-iron-text font-semibold text-right">{reward.value}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={onClose}
            className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
