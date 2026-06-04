"use client";

import { fadeUp } from "../../animations/classes";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

type Props = {
  message: string;
  className?: string;
};

/** Minimal success acknowledgement — no confetti. */
export default function CompletionMoment({ message, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={`flex items-center gap-2.5 border border-iron-accent/40 bg-iron-accent/10 rounded-sm px-3 py-2.5 ${
        reduced ? "" : fadeUp
      } ${className}`}
      role="status"
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-sm border border-iron-accent flex items-center justify-center text-iron-accent text-sm font-bold ${
          reduced ? "" : "iron-done-pop"
        }`}
        aria-hidden="true"
      >
        ✓
      </span>
      <p className="text-sm font-medium text-iron-text leading-snug">{message}</p>
    </div>
  );
}
