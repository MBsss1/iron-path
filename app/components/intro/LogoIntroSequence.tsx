"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedIronPathLogo from "../AnimatedIronPathLogo";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  onBegin: () => void;
};

const TAGLINE_KEYS = [
  "intro.logo.line1",
  "intro.logo.line2",
  "intro.logo.line3",
] as const;

/** Mount-only timeline — must not cancel on unrelated state updates. */
const TIMELINE_MS = {
  glint: 1200,
  tagline1: 1750,
  tagline2: 2150,
  tagline3: 2550,
} as const;

export default function LogoIntroSequence({ onBegin }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const onBeginRef = useRef(onBegin);
  onBeginRef.current = onBegin;

  const [glint, setGlint] = useState(reduced);
  const [visibleTaglines, setVisibleTaglines] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) {
      setGlint(true);
      setVisibleTaglines(3);
      return;
    }

    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    schedule(() => setGlint(true), TIMELINE_MS.glint);
    schedule(() => setVisibleTaglines(1), TIMELINE_MS.tagline1);
    schedule(() => setVisibleTaglines(2), TIMELINE_MS.tagline2);
    schedule(() => setVisibleTaglines(3), TIMELINE_MS.tagline3);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reduced]);

  return (
    <div
      className="logo-intro-scene flex flex-col items-center justify-center text-center px-6 w-full max-w-sm"
      aria-label={t("intro.logo.ariaLabel")}
    >
      <div
        className={`logo-intro-hero relative ${
          glint ? "logo-intro-hero--glint" : ""
        }`}
      >
        <AnimatedIronPathLogo
          className="logo-intro-mark"
          reducedMotion={reduced}
        />
        <span className="logo-intro-glint" aria-hidden="true" />
      </div>

      <div className="logo-intro-taglines mt-8 space-y-2 w-full logo-intro-taglines--visible">
        {TAGLINE_KEYS.map((key, index) => (
          <p
            key={key}
            className={`logo-intro-tagline text-sm sm:text-base tracking-wide text-iron-accent ${
              index < visibleTaglines ? "logo-intro-tagline--visible" : "opacity-0"
            }`}
          >
            {t(key)}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onBeginRef.current()}
        className="iron-interactive iron-btn-primary w-full mt-8 py-4 text-base font-semibold min-h-[56px] rounded-sm"
      >
        {t("intro.beginPath")}
      </button>
    </div>
  );
}
