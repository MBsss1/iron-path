"use client";

import { useCallback, useEffect, useState } from "react";
import Stagger from "../animations/Stagger";
import { fadeUp } from "../animations/classes";
import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";
import { useTranslation } from "../i18n/useTranslation";
import { markIntroSeen } from "../utils/introStorage";

type Props = {
  onComplete: () => void;
};

type Scene = 1 | 2 | 3 | 4;

const INTRO_CARDS = ["assessment", "plan", "progress"] as const;

export default function IntroExperience({ onComplete }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [scene, setScene] = useState<Scene>(1);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [visibleCards, setVisibleCards] = useState(0);

  const advanceScene = useCallback(() => {
    setSceneVisible(false);
    window.setTimeout(() => {
      setScene((s) => {
        if (s >= 4) return s;
        return (s + 1) as Scene;
      });
      setSceneVisible(true);
    }, reduced ? 0 : 220);
  }, [reduced]);

  useEffect(() => {
    if (scene === 1) {
      const id = window.setTimeout(advanceScene, reduced ? 800 : 2400);
      return () => window.clearTimeout(id);
    }
    if (scene === 2) {
      const id = window.setTimeout(advanceScene, reduced ? 600 : 3400);
      return () => window.clearTimeout(id);
    }
    if (scene === 3) {
      setVisibleCards(0);
    }
  }, [scene, advanceScene, reduced]);

  useEffect(() => {
    if (scene !== 3 || reduced) {
      if (scene === 3 && reduced) setVisibleCards(INTRO_CARDS.length);
      return;
    }
    if (visibleCards >= INTRO_CARDS.length) {
      const id = window.setTimeout(advanceScene, 1200);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(
      () => setVisibleCards((n) => n + 1),
      visibleCards === 0 ? 400 : 550
    );
    return () => window.clearTimeout(id);
  }, [scene, visibleCards, advanceScene, reduced]);

  const handleBegin = () => {
    markIntroSeen();
    onComplete();
  };

  const anim = sceneVisible && !reduced ? fadeUp : "";

  return (
    <div className="fixed inset-0 z-[101] iron-page flex flex-col items-center justify-center px-6 py-10">
      {scene === 1 && (
        <div className={`text-center max-w-sm ${anim}`}>
          <div
            className={`intro-logo-shell iron-shell-card py-12 px-10 border border-iron-border-strong inline-block ${
              reduced ? "" : "intro-logo-enter"
            }`}
          >
            <h1 className="iron-heading text-4xl tracking-wide text-iron-text">
              {t("intro.scene1.title")}
            </h1>
            <p
              className={`mt-4 text-sm text-iron-accent tracking-wide ${
                reduced ? "" : "intro-tagline-enter"
              }`}
            >
              {t("intro.scene1.tagline")}
            </p>
          </div>
        </div>
      )}

      {scene === 2 && (
        <div className={`max-w-sm w-full space-y-4 text-center ${anim}`}>
          <Stagger className="space-y-4">
            <p className="text-lg text-iron-text font-medium leading-relaxed">
              {t("intro.scene2.line1")}
            </p>
            <p className="text-lg text-iron-muted leading-relaxed">
              {t("intro.scene2.line2")}
            </p>
            <p className="text-xl text-iron-accent font-semibold leading-relaxed">
              {t("intro.scene2.line3")}
            </p>
          </Stagger>
        </div>
      )}

      {scene === 3 && (
        <div className={`max-w-xs w-full ${anim}`}>
          <div className="relative space-y-3 min-h-[220px]">
            {INTRO_CARDS.map((key, index) => {
              const visible = index < visibleCards;
              const offset = index * 6;
              return (
                <div
                  key={key}
                  className={`intro-product-card border border-iron-border rounded-sm p-4 bg-iron-panel shadow-[var(--iron-shadow-card)] ${
                    visible && !reduced ? "intro-product-card-enter" : ""
                  } ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                  style={
                    reduced
                      ? undefined
                      : {
                          ["--intro-card-x" as string]: `${offset}px`,
                          animationDelay: `${index * 120}ms`,
                        }
                  }
                >
                  <p className="iron-label text-[10px] text-iron-accent">
                    {t(`intro.scene3.step`, { step: index + 1 })}
                  </p>
                  <p className="iron-heading text-base mt-1">
                    {t(`intro.scene3.${key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {scene === 4 && (
        <div className={`max-w-sm w-full text-center space-y-6 ${anim}`}>
          <h2 className="iron-heading text-3xl">{t("intro.scene4.title")}</h2>
          <button
            type="button"
            onClick={handleBegin}
            className="iron-interactive iron-btn-primary w-full py-4 text-base font-semibold min-h-[56px] rounded-sm"
          >
            {t("intro.scene4.cta")}
          </button>
        </div>
      )}
    </div>
  );
}
