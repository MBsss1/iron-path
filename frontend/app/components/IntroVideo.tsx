"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { markIntroSeen } from "../utils/introStorage";

const INTRO_VIDEO_URL = "https://ironpath.icu/videos/intro.mp4";

type Phase = "fade-in" | "playing" | "fade-out" | "done";

type Props = {
  onComplete: () => void;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function IntroVideo({ onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("fade-in");
  const [skipped, setSkipped] = useState(false);

  const finish = useCallback(
    (persistSeen: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (persistSeen) {
        markIntroSeen();
      }
      setPhase("done");
      onComplete();
    },
    [onComplete]
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setSkipped(true);
      finish(false);
    }
  }, [finish]);

  useEffect(() => {
    if (phase !== "fade-out") return;

    const timer = window.setTimeout(() => finish(true), 500);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  const handleVideoEnded = () => {
    setPhase("fade-out");
  };

  const handleVideoError = () => {
    finish(true);
  };

  if (phase === "done" || skipped) {
    return null;
  }

  return (
    <div
      className={`intro-video-overlay intro-video-overlay--${phase}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
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
