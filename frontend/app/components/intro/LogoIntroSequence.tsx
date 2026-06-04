"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";
import { useTranslation } from "../../i18n/useTranslation";
import IronPathLogoSvg from "./IronPathLogoSvg";
import {
  LOGO_ASSEMBLY_ORDER,
  LOGO_INTRO_TIMING_MS,
  type LogoPartId,
} from "./ironPathLogoGeometry";

type Phase = "assemble" | "glint" | "taglines" | "cta";

type Props = {
  onBegin: () => void;
};

const TAGLINE_KEYS = [
  "intro.logo.line1",
  "intro.logo.line2",
  "intro.logo.line3",
] as const;

export default function LogoIntroSequence({ onBegin }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "cta" : "assemble");
  const [activeParts, setActiveParts] = useState<Set<LogoPartId>>(
    () => new Set(reduced ? LOGO_ASSEMBLY_ORDER : [])
  );
  const [visibleTaglines, setVisibleTaglines] = useState(reduced ? 3 : 0);

  const timing = useMemo(
    () =>
      reduced
        ? {
            partStagger: 0,
            partDuration: 0,
            assembleSettle: 0,
            glint: 0,
            taglineStagger: 0,
            taglineBeforeCta: 0,
          }
        : LOGO_INTRO_TIMING_MS,
    [reduced]
  );

  const assembled =
    reduced || phase !== "assemble" || activeParts.size >= LOGO_ASSEMBLY_ORDER.length;

  const showWordmark = reduced || phase !== "assemble";
  const showGlint = phase === "glint" || phase === "taglines" || phase === "cta";
  const showTaglines = phase === "taglines" || phase === "cta";
  const showCta = phase === "cta";

  useEffect(() => {
    if (reduced || phase !== "assemble") return;

    let cancelled = false;
    const timers: number[] = [];

    LOGO_ASSEMBLY_ORDER.forEach((partId, index) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setActiveParts((prev) => new Set([...prev, partId]));
        }, index * timing.partStagger)
      );
    });

    const assembleEnd =
      LOGO_ASSEMBLY_ORDER.length * timing.partStagger +
      timing.partDuration +
      timing.assembleSettle;

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("glint");
      }, assembleEnd)
    );

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("taglines");
        setVisibleTaglines(1);
      }, assembleEnd + timing.glint)
    );

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [phase, reduced, timing]);

  useEffect(() => {
    if (phase !== "taglines" || reduced) return;

    if (visibleTaglines < 3) {
      const id = window.setTimeout(
        () => setVisibleTaglines((n) => Math.min(3, n + 1)),
        timing.taglineStagger
      );
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(
      () => setPhase("cta"),
      timing.taglineBeforeCta
    );
    return () => window.clearTimeout(id);
  }, [phase, visibleTaglines, reduced, timing]);

  const handleBegin = useCallback(() => {
    onBegin();
  }, [onBegin]);

  return (
    <div
      className="logo-intro-scene flex flex-col items-center justify-center text-center px-6 w-full max-w-sm"
      aria-label={t("intro.logo.ariaLabel")}
    >
      <div
        className={`logo-intro-hero relative text-iron-text ${
          showGlint ? "logo-intro-hero--glint" : ""
        } ${assembled ? "logo-intro-hero--assembled" : ""}`}
      >
        <IronPathLogoSvg
          activeParts={activeParts}
          showWordmark={showWordmark}
          assembled={assembled}
        />
        <span className="logo-intro-glint" aria-hidden="true" />
      </div>

      <div
        className={`logo-intro-taglines mt-8 space-y-2 w-full ${
          showTaglines ? "logo-intro-taglines--visible" : ""
        }`}
      >
        {TAGLINE_KEYS.map((key, index) => (
          <p
            key={key}
            className={`logo-intro-tagline text-sm sm:text-base tracking-wide text-iron-accent ${
              index < visibleTaglines ? "logo-intro-tagline--visible" : ""
            }`}
          >
            {t(key)}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={handleBegin}
        className={`iron-interactive iron-btn-primary w-full mt-8 py-4 text-base font-semibold min-h-[56px] rounded-sm transition-all duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-out)] ${
          showCta
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {t("intro.scene4.cta")}
      </button>
    </div>
  );
}
