"use client";

import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";

type Props = {
  formatted: string;
  className?: string;
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

export default function AnimatedTimerDigits({ formatted, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  let wheelIndex = 0;

  return (
    <span
      className={`inline-flex items-center justify-center tabular-nums ${className}`}
      aria-hidden="true"
    >
      {formatted.split("").map((char, index) => {
        if (char === ":") {
          return (
            <span key={`sep-${index}`} className="digit-wheel-separator">
              :
            </span>
          );
        }
        const parsed = parseInt(char, 10);
        if (Number.isNaN(parsed)) {
          return (
            <span key={`raw-${index}`} className="digit-wheel-cell">
              {char}
            </span>
          );
        }
        const key = `wheel-${wheelIndex}`;
        wheelIndex += 1;
        return <DigitWheel key={key} digit={parsed} reduced={reduced} />;
      })}
    </span>
  );
}
