"use client";

import { ReactNode, useRef } from "react";
import { stageEnter, stageExit, stepEnter, screenExit } from "./classes";
import { useTransitionPhase } from "./useTransitionPhase";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  stepKey: string;
  children: ReactNode;
  className?: string;
  /** Training warmup → workout uses stronger vertical shift. */
  variant?: "default" | "training-stage";
};

const STAGE_EXIT_MS = 260;

export default function StepTransition({
  stepKey,
  children,
  className = "",
  variant = "default",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const exitMs = variant === "training-stage" ? STAGE_EXIT_MS : 240;
  const { displayKey, phase } = useTransitionPhase(stepKey, exitMs);
  const cacheRef = useRef<Record<string, ReactNode>>({});

  if (children != null && children !== false) {
    cacheRef.current[stepKey] = children;
  }

  const content = cacheRef.current[displayKey] ?? children;

  let animClass = "";
  if (!reduced) {
    if (variant === "training-stage") {
      animClass = phase === "exit" ? stageExit : stageEnter;
    } else {
      animClass = phase === "exit" ? screenExit : stepEnter;
    }
  }

  return (
    <div key={displayKey} className={`${animClass} ${className}`.trim()}>
      {content}
    </div>
  );
}
