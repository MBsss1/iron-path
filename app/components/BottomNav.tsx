"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { tabIndicatorMotion, tabPress } from "../animations/classes";
import { hapticTab } from "../utils/haptics";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  screen: string;
  setScreen: (screen: string) => void;
  trainingPulse?: boolean;
};

const NAV_ITEMS = [
  { id: "hero", labelKey: "nav.home", icon: "★" },
  { id: "today", labelKey: "nav.today", icon: "✓" },
  { id: "training", labelKey: "nav.train", icon: "◆" },
  { id: "nutrition", labelKey: "nav.food", icon: "◇" },
  { id: "more", labelKey: "nav.more", icon: "☰" },
] as const;

type IndicatorMetrics = {
  x: number;
  width: number;
};

export default function BottomNav({ screen, setScreen, trainingPulse = false }: Props) {
  const { t } = useTranslation();
  const [pressedId, setPressedId] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorMetrics>({ x: 0, width: 0 });

  const activeIndex = useMemo(
    () => Math.max(0, NAV_ITEMS.findIndex((item) => item.id === screen)),
    [screen]
  );

  const measureIndicator = () => {
    const nav = navRef.current;
    const btn = itemRefs.current[activeIndex];
    if (!nav || !btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      x: btnRect.left - navRect.left,
      width: btnRect.width,
    });
  };

  useLayoutEffect(() => {
    measureIndicator();
  }, [activeIndex, screen, t]);

  useLayoutEffect(() => {
    const onResize = () => measureIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, screen, t]);

  const handleSelect = (name: string) => {
    hapticTab();
    setPressedId(name);
    if (screen !== name) {
      setScreen(name);
    }
    window.setTimeout(() => setPressedId(null), 160);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-40 iron-nav-glass pb-[env(safe-area-inset-bottom)]"
      aria-label={t("nav.ariaLabel")}
    >
      <div
        ref={navRef}
        className="relative max-w-md mx-auto flex justify-around items-stretch px-1"
      >
        <span
          className={`pointer-events-none absolute top-0 left-0 h-0.5 rounded-full bg-iron-accent iron-nav-active-indicator ${tabIndicatorMotion}`}
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.x}px)`,
          }}
          aria-hidden="true"
        />

        {NAV_ITEMS.map(({ id, labelKey, icon }, index) => {
          const isActive = screen === id;
          const isPressed = pressedId === id;
          const isTraining = id === "training";

          return (
            <button
              key={id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onClick={() => handleSelect(id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[60px] min-w-[52px] py-2 px-1 text-[10px] font-semibold tracking-wide iron-interactive iron-nav-tab-label ${
                isActive ? "text-iron-accent iron-nav-tab-active" : "text-iron-muted"
              } ${isPressed ? tabPress : ""} ${
                isTraining && trainingPulse && !isActive ? "iron-nav-training-pulse" : ""
              }`}
            >
              <span
                className={`iron-nav-tab-icon text-base leading-none ${
                  isActive ? "text-iron-accent" : ""
                }`}
              >
                {icon}
              </span>

              <span className={`mt-1 ${isActive ? "text-iron-text" : ""}`}>
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
