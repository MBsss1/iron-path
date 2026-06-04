"use client";

import { ReactNode } from "react";
import { stepTransition } from "./classes";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  stepKey: string;
  children: ReactNode;
  className?: string;
};

/** Animates step/wizard content when `stepKey` changes. */
export default function StepTransition({ stepKey, children, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      key={stepKey}
      className={`${reduced ? "" : stepTransition} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
