"use client";

import { useCallback, useEffect, useState } from "react";
import Stagger from "../animations/Stagger";
import { fadeScale, fadeUp } from "../animations/classes";
import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";
import { useTranslation } from "../i18n/useTranslation";
import { markIntroSeen } from "../utils/introStorage";

type Props = {
  onComplete: () => void;
};

type Scene = 1 | 2 | 3 | 4;

export default function IntroExperience({ onComplete }: Props) {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [scene, setScene] = useState<Scene>(1);
  const [sceneVisible, setSceneVisible] = useState(true);

  const advanceScene = useCallback(() => {
    setSceneVisible(false);
    window.setTimeout(() => {
      setScene((s) => {
        if (s >= 4) return s;
        return (s + 1) as Scene;
      });
      setSceneVisible(true);
    }, reduced ? 0 : 200);
  }, [reduced]);

  useEffect(() => {
    if (scene === 1) {
      const id = window.setTimeout(advanceScene, reduced ? 800 : 2200);
      return () => window.clearTimeout(id);
    }
    if (scene === 2) {
      const id = window.setTimeout(advanceScene, reduced ? 600 : 3200);
      return () => window.clearTimeout(id);
    }
    if (scene === 3) {
      const id = window.setTimeout(advanceScene, reduced ? 600 : 2800);
      return () => window.clearTimeout(id);
    }
  }, [scene, advanceScene, reduced]);

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
            className={`iron-shell-card py-12 px-10 border border-iron-border-strong inline-block ${
              reduced ? "" : fadeScale
            }`}
          >
            <h1 className="iron-heading text-4xl tracking-wide text-iron-text">
              {t("intro.scene1.title")}
            </h1>
            <p className="mt-4 text-sm text-iron-accent tracking-wide">
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
          <Stagger className="space-y-3">
            {(["assessment", "plan", "progress"] as const).map((key) => (
              <div
                key={key}
                className="border border-iron-border rounded-sm p-4 bg-iron-panel text-center"
              >
                <p className="iron-heading text-base">{t(`intro.scene3.${key}`)}</p>
              </div>
            ))}
          </Stagger>
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
