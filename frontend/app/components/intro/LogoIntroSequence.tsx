"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";
import { useTranslation } from "../../i18n/useTranslation";
import IronPathLogoSvg from "./IronPathLogoSvg";

type Props = {
  onBegin: () => void;
};

const TAGLINE_KEYS = [
  "intro.logo.line1",
  "intro.logo.line2",
  "intro.logo.line3",
] as const;

/** Mount-only timeline — phase state changes must not cancel pending steps. */
const TIMELINE_MS = {
  logoReveal: 80,
  glint: 1100,
  tagline1: 1750,
  tagline2: 2150,
  tagline3: 2550,
} as const;

export default function LogoIntroSequence({ onBegin }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const onBeginRef = useRef(onBegin);
  onBeginRef.current = onBegin;

  const [logoRevealed, setLogoRevealed] = useState(reduced);
  const [glint, setGlint] = useState(reduced);
  const [visibleTaglines, setVisibleTaglines] = useState(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) {
      setLogoRevealed(true);
      setGlint(true);
      setVisibleTaglines(3);
      return;
    }

    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    schedule(() => setLogoRevealed(true), TIMELINE_MS.logoReveal);
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
        className={`logo-intro-hero relative text-iron-text ${
          glint ? "logo-intro-hero--glint" : ""
        }`}
      >
        <IronPathLogoSvg revealed={logoRevealed} />
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
