"use client";

import { useCallback, useEffect, useRef } from "react";
import LogoIntroSequence from "./intro/LogoIntroSequence";
import { markIntroSeen } from "../utils/introStorage";
import { useTranslation } from "../i18n/useTranslation";

const INTRO_FAILSAFE_MS = 8000;

type Props = {
  onComplete: () => void;
};

/** First-run intro — must never block the app. */
export default function IntroExperience({ onComplete }: Props) {
  const { t } = useTranslation();
  const finishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    markIntroSeen();
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const autoId = window.setTimeout(finishIntro, INTRO_FAILSAFE_MS);
    return () => window.clearTimeout(autoId);
  }, [finishIntro]);

  return (
    <div className="fixed inset-0 z-[101] iron-page flex flex-col items-center justify-center px-6 py-10 bg-[var(--iron-bg)]">
      <button
        type="button"
        onClick={finishIntro}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 iron-interactive text-sm font-semibold text-iron-muted hover:text-iron-text px-3 py-2 rounded-sm border border-iron-border bg-iron-panel/90"
      >
        {t("intro.skip")}
      </button>

      <LogoIntroSequence onBegin={finishIntro} />
    </div>
  );
}
