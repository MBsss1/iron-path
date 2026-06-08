"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { IntroVideoResult } from "../hooks/useIntroFlow";
import { useTranslation } from "../i18n/useTranslation";
import { markIntroSeen } from "../utils/introStorage";

const INTRO_VIDEO_URL = "https://ironpath.icu/videos/intro.mp4";

type Phase = "fade-in" | "playing" | "fade-out" | "done";

type Props = {
  onComplete: (result: IntroVideoResult) => void;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function IntroVideo({ onComplete }: Props) {
  const { t } = useTranslation();
  const finishedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("fade-in");
  const [hidden, setHidden] = useState(false);

  const finish = useCallback(
    (result: IntroVideoResult, persistSeen: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (persistSeen) {
        markIntroSeen();
      }
      setPhase("done");
      setHidden(true);
      onComplete(result);
    },
    [onComplete]
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      finish("fallback", false);
    }
  }, [finish]);

  useEffect(() => {
    if (phase !== "fade-out") return;

    const timer = window.setTimeout(() => finish("completed", true), 500);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  const handleSkip = () => {
    finish("skipped", true);
  };

  const handleVideoEnded = () => {
    setPhase("fade-out");
  };

  const handleVideoError = () => {
    finish("fallback", false);
  };

  if (hidden || phase === "done") {
    return null;
  }

  return (
    <div
      className={`intro-video-overlay intro-video-overlay--${phase}`}
      aria-hidden="true"
    >
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 iron-interactive text-sm font-semibold text-iron-muted hover:text-iron-text px-3 py-2 rounded-sm border border-iron-border bg-iron-panel/90"
      >
        {t("intro.skip")}
      </button>

      <video
        className="intro-video-player"
        src={INTRO_VIDEO_URL}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
      />
    </div>
  );
}
