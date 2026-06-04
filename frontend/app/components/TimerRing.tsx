"use client";

import { useId } from "react";
import { formatTimerDisplay } from "../hooks/useTimerEngine";

const RING_RADIUS = 54;
export const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type Props = {
  displaySeconds: number;
  progress: number;
  showHours: boolean;
  size?: "large" | "compact";
  dangerPhase?: boolean;
  finished?: boolean;
  sublabel?: string;
};

export default function TimerRing({
  displaySeconds,
  progress,
  showHours,
  size = "large",
  dangerPhase = false,
  finished = false,
  sublabel,
}: Props) {
  const ringGradientId = useId();
  const ringOffset = TIMER_RING_CIRCUMFERENCE * (1 - progress);
  const dim = size === "large" ? "w-44 h-44 sm:w-48 sm:h-48" : "w-36 h-36";
  const digitClass =
    size === "large"
      ? "text-4xl sm:text-5xl font-semibold tracking-tight"
      : "text-3xl font-semibold tracking-tight";

  return (
    <div className={`relative ${dim} training-timer-ring-wrap`}>
      <svg
        className="w-full h-full -rotate-90 training-timer-ring"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--iron-accent-dim)" />
            <stop offset="100%" stopColor="var(--iron-accent)" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--iron-border)"
          strokeWidth="5"
        />
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          fill="none"
          stroke={
            dangerPhase || finished
              ? "var(--iron-accent)"
              : `url(#${ringGradientId})`
          }
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={TIMER_RING_CIRCUMFERENCE}
          strokeDashoffset={ringOffset}
          className="training-timer-ring-progress"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-iron-text"
        role="timer"
        aria-live="polite"
      >
        <span
          key={displaySeconds}
          className={`tabular-nums training-timer-digits ${digitClass}`}
        >
          {formatTimerDisplay(displaySeconds, showHours)}
        </span>
        {sublabel && (
          <span className="text-[10px] uppercase tracking-wider text-iron-muted mt-1.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
