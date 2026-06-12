"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: Props) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"fade-in" | "fade-out">("fade-in");

  useEffect(() => {
    const fadeOutTimer = window.setTimeout(() => setPhase("fade-out"), 1200);
    const completeTimer = window.setTimeout(() => onComplete(), 1600);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center iron-page ${
        phase === "fade-in" ? "animate-splash-fade-in" : "animate-splash-fade-out"
      }`}
      aria-hidden="true"
    >
      <div className="text-center iron-shell-card py-10 px-12 animate-splash-logo border border-iron-border-strong">
        <h1 className="iron-heading text-4xl tracking-wide">{t("app.title")}</h1>
        <p className="iron-page-header-sub mt-3">{t("app.tagline")}</p>
        <div className="mt-6 h-0.5 w-24 mx-auto bg-iron-accent-dim" />
        <p className="mt-4 text-xs text-iron-muted">{t("app.loadingJournal")}</p>
      </div>
    </div>
  );
}
