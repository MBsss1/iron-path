"use client";

import { useEffect } from "react";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  amount: number;
  onDone: () => void;
};

export default function XpFloatAnimation({ amount, onDone }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = window.setTimeout(onDone, 1350);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-xp-float"
      aria-live="polite"
    >
      <div className="iron-shell-card px-6 py-3 border border-iron-border-strong">
        <p className="text-xl font-semibold iron-text-accent">
          {t("hero.xpGain", { amount })}
        </p>
      </div>
    </div>
  );
}
