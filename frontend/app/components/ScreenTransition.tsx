"use client";

import { ReactNode, useRef } from "react";
import { screenEnter, screenExit } from "../animations/classes";
import { useTransitionPhase } from "../animations/useTransitionPhase";
import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";

type Props = {
  screen: string;
  children: ReactNode;
};

const EXIT_MS = 240;

export default function ScreenTransition({ screen, children }: Props) {
  const reduced = usePrefersReducedMotion();
  const { displayKey, phase } = useTransitionPhase(screen, EXIT_MS);
  const cacheRef = useRef<Record<string, ReactNode>>({});

  if (children != null && children !== false) {
    cacheRef.current[screen] = children;
  }

  const content = cacheRef.current[displayKey] ?? children;

  let animClass = "";
  if (!reduced) {
    animClass = phase === "exit" ? screenExit : screenEnter;
  }

  return (
    <div key={displayKey} className={`w-full ${animClass}`.trim()}>
      {content}
    </div>
  );
}
