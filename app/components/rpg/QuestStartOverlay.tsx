"use client";

import { useEffect } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

type Props = {
  active: boolean;
  onComplete: () => void;
  durationMs?: number;
};

export default function QuestStartOverlay({
  active,
  onComplete,
  durationMs = 650,
}: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      onComplete();
      return;
    }

    const timer = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(timer);
  }, [active, durationMs, onComplete, reduced]);

  if (!active) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center pointer-events-none ${
        reduced ? "" : "iron-quest-start-overlay"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`iron-quest-start-panel ${reduced ? "" : "iron-quest-start-panel-animate"}`}
      >
        <p className="iron-quest-start-eyebrow">{t("animations.questEyebrow")}</p>
        <p className="iron-quest-start-title">{t("animations.questStarted")}</p>
      </div>
    </div>
  );
}
