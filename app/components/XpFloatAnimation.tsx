"use client";

import { useEffect } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";

type Props = {
  amount: number;
  onDone: () => void;
};

export default function XpFloatAnimation({ amount, onDone }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onDone, reduced ? 0 : 1350);
    return () => window.clearTimeout(timer);
  }, [onDone, reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-[60] iron-xp-float-burst"
      aria-live="polite"
    >
      <div className="iron-xp-float-chip px-6 py-3">
        <p className="text-xl font-semibold iron-text-accent tabular-nums">
          {t("hero.xpGain", { amount })}
        </p>
      </div>
    </div>
  );
}
