"use client";

import { useRef } from "react";
import AnimatedIronPathLogo from "../AnimatedIronPathLogo";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  onBegin: () => void;
};

const PHRASE_KEYS = [
  "intro.logo.line1",
  "intro.logo.line2",
  "intro.logo.line3",
] as const;

export default function IntroSequence({ onBegin }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const onBeginRef = useRef(onBegin);
  onBeginRef.current = onBegin;

  const motionClass = reduced ? "intro-sequence--static" : "intro-sequence--animate";

  return (
    <div
      className={`intro-sequence ${motionClass} flex flex-col items-center justify-center text-center px-6 w-full max-w-sm`}
      aria-label={t("intro.logo.ariaLabel")}
    >
      <div className="intro-sequence-logo-wrap relative">
        <span className="intro-sequence-glow" aria-hidden="true" />
        <AnimatedIronPathLogo
          className="intro-sequence-mark relative z-[1]"
          reducedMotion={reduced}
        />
      </div>

      <div className="intro-sequence-phrases mt-10 space-y-2.5 w-full">
        {PHRASE_KEYS.map((key, index) => (
          <p
            key={key}
            className={`intro-sequence-phrase intro-sequence-phrase-${index + 1} iron-heading text-lg sm:text-xl tracking-wide text-iron-accent`}
          >
            {t(key)}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onBeginRef.current()}
        className="intro-sequence-cta iron-interactive iron-btn-primary w-full mt-12 py-4 text-base font-semibold min-h-[56px] rounded-sm"
      >
        {t("intro.beginPath")}
      </button>
    </div>
  );
}
