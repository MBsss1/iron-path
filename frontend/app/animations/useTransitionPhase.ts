"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Two-phase enter/exit when `key` changes. */
export function useTransitionPhase(
  key: string,
  exitDurationMs = 240
): { displayKey: string; phase: "enter" | "exit" | "idle" } {
  const reduced = usePrefersReducedMotion();
  const [displayKey, setDisplayKey] = useState(key);
  const [phase, setPhase] = useState<"enter" | "exit" | "idle">(
    reduced ? "idle" : "enter"
  );

  useEffect(() => {
    if (reduced) {
      setDisplayKey(key);
      setPhase("idle");
      return;
    }
    if (key === displayKey) {
      setPhase("enter");
      return;
    }
    setPhase("exit");
    const timer = setTimeout(() => {
      setDisplayKey(key);
      setPhase("enter");
    }, exitDurationMs);
    return () => clearTimeout(timer);
  }, [key, displayKey, reduced, exitDurationMs]);

  return { displayKey, phase };
}
