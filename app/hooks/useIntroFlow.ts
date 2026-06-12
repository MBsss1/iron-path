"use client";

import { useCallback, useEffect, useState } from "react";
import { hasIntroSeen } from "../utils/introStorage";

export type IntroFlowPhase =
  | "idle"
  | "introVideoPending"
  | "introVideoDone"
  | "fallbackIntroOnly"
  | "splash";

export type IntroVideoResult = "completed" | "skipped" | "fallback";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useIntroFlow(languageLoaded: boolean, languageChosen: boolean) {
  const [phase, setPhase] = useState<IntroFlowPhase>("idle");

  useEffect(() => {
    if (!languageLoaded) return;

    if (!languageChosen) {
      setPhase("idle");
      return;
    }

    if (hasIntroSeen()) {
      setPhase("splash");
      return;
    }

    if (prefersReducedMotion()) {
      setPhase("fallbackIntroOnly");
      return;
    }

    setPhase("introVideoPending");
  }, [languageLoaded, languageChosen]);

  const handleVideoComplete = useCallback((result: IntroVideoResult) => {
    if (result === "fallback") {
      setPhase("fallbackIntroOnly");
      return;
    }

    setPhase("introVideoDone");
  }, []);

  const handleFallbackComplete = useCallback(() => {
    setPhase("idle");
  }, []);

  const handleSplashComplete = useCallback(() => {
    setPhase("idle");
  }, []);

  const showIntroVideo = phase === "introVideoPending";
  const showFallbackIntro = phase === "fallbackIntroOnly";
  const showSplash = phase === "splash";
  const introBlocking =
    phase === "introVideoPending" || phase === "fallbackIntroOnly";

  return {
    phase,
    showIntroVideo,
    showFallbackIntro,
    showSplash,
    introBlocking,
    handleVideoComplete,
    handleFallbackComplete,
    handleSplashComplete,
  };
}
