"use client";

import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

type Props = {
  active: boolean;
  className?: string;
};

/** Gold spark particles around the XP bar — CSS only. */
export default function XPGainBurst({ active, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();

  if (!active || reduced) return null;

  const sparks = [0, 1, 2, 3, 4, 5];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`.trim()}
      aria-hidden="true"
    >
      {sparks.map((i) => (
        <span
          key={i}
          className={`iron-xp-spark iron-xp-spark-${i}`}
        />
      ))}
    </div>
  );
}
