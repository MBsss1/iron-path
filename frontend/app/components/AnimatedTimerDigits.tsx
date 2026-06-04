"use client";

import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";
import {
  formatTimerDisplay,
  getTimeSlots,
} from "../hooks/useTimerEngine";

type Props = {
  displaySeconds: number;
  showHours?: boolean;
  className?: string;
  /** Accessible label; defaults to formatted time. */
  ariaLabel?: string;
};

const DIGIT_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function DigitWheel({
  digit,
  reduced,
}: {
  digit: number;
  reduced: boolean;
}) {
  const safe = Number.isFinite(digit) && digit >= 0 && digit <= 9 ? digit : 0;

  return (
    <span className="digit-wheel-slot" aria-hidden="true">
      <span
        className="digit-wheel-strip"
        style={{
          transform: `translate3d(0, ${-safe * 10}%, 0)`,
          transition: reduced
            ? "none"
            : "transform var(--motion-duration-normal) var(--motion-ease-out)",
        }}
      >
        {DIGIT_VALUES.map((value) => (
          <span key={value} className="digit-wheel-cell">
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function AnimatedTimerDigits({
  displaySeconds,
  showHours = false,
  className = "",
  ariaLabel,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const slots = getTimeSlots(displaySeconds, showHours);
  const label =
    ariaLabel ?? formatTimerDisplay(displaySeconds, showHours || displaySeconds >= 3600);

  return (
    <span
      className={`inline-flex items-center justify-center tabular-nums ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={label}
    >
      {slots.map((slot) => {
        if (slot.kind === "sep") {
          return (
            <span key={slot.id} className="digit-wheel-separator">
              :
            </span>
          );
        }
        return (
          <DigitWheel key={slot.id} digit={slot.value} reduced={reduced} />
        );
      })}
    </span>
  );
}
