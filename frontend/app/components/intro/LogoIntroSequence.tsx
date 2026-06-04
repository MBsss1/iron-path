"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";
import { useTranslation } from "../../i18n/useTranslation";
import IronPathLogoMark from "./IronPathLogoMark";
import {
  LOGO_ASSEMBLY_ORDER,
  LOGO_INTRO_TIMING_MS,
  type LogoPartId,
} from "./ironPathLogoGeometry";

type Phase = "assemble" | "unified" | "glint" | "taglines" | "shrink" | "done";

type Props = {
  onComplete: () => void;
};

const TAGLINE_KEYS = ["intro.logo.line1", "intro.logo.line2", "intro.logo.line3"] as const;

export default function LogoIntroSequence({ onComplete }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "taglines" : "assemble");
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
            taglineHold: 400,
            shrink: 280,
            handoff: 120,
          }
        : LOGO_INTRO_TIMING_MS,
    [reduced]
  );

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
        setPhase("unified");
      }, assembleEnd)
    );

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("glint");
      }, assembleEnd + 120)
    );

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        setPhase("taglines");
        setVisibleTaglines(1);
      }, assembleEnd + 120 + timing.glint)
    );

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [phase, reduced, timing]);

  useEffect(() => {
    if (phase !== "taglines") return;

    if (reduced) {
      const shrinkId = window.setTimeout(() => setPhase("shrink"), timing.taglineHold);
      return () => window.clearTimeout(shrinkId);
    }

    const timers: number[] = [];

    if (visibleTaglines < 3) {
      timers.push(
        window.setTimeout(
          () => setVisibleTaglines((n) => Math.min(3, n + 1)),
          timing.taglineStagger
        )
      );
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

    timers.push(
      window.setTimeout(() => setPhase("shrink"), timing.taglineHold)
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, visibleTaglines, reduced, timing]);

  const finish = useCallback(() => {
    setPhase("done");
    window.setTimeout(onComplete, timing.handoff);
  }, [onComplete, timing.handoff]);

  useEffect(() => {
    if (phase !== "shrink") return;
    const id = window.setTimeout(finish, timing.shrink);
    return () => window.clearTimeout(id);
  }, [phase, finish, timing.shrink]);

  const showMarkParts = phase === "assemble";
  const showOfficialImage = phase !== "assemble" && phase !== "done";
  const showGlint = phase === "glint" || phase === "taglines" || phase === "shrink";
  const isShrinking = phase === "shrink" || phase === "done";

  return (
    <div
      className={`logo-intro-scene flex flex-col items-center justify-center text-center px-6 ${
        isShrinking ? "logo-intro-scene--shrink" : ""
      }`}
      aria-label={t("intro.logo.ariaLabel")}
    >
      <div
        className={`logo-intro-hero relative text-iron-text ${
          showGlint ? "logo-intro-hero--glint" : ""
        }`}
      >
        {showMarkParts && (
          <IronPathLogoMark activeParts={activeParts} className="logo-intro-hero__mark" />
        )}

        <div
          className={`logo-intro-hero__official ${
            showOfficialImage ? "logo-intro-hero__official--visible" : ""
          }`}
        >
          <Image
            src="/brand/iron-path-logo.png"
            alt=""
            width={149}
            height={134}
            priority
            className="logo-intro-hero__img"
            aria-hidden="true"
          />
        </div>

        <span className="logo-intro-glint" aria-hidden="true" />
      </div>

      <div
        className={`logo-intro-taglines mt-8 space-y-2 ${
          phase === "taglines" || phase === "shrink" ? "logo-intro-taglines--visible" : ""
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
    </div>
  );
}
