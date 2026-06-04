"use client";

import { useMemo } from "react";
import { tabIndicatorMotion } from "../animations/classes";
import { hapticTab } from "../utils/haptics";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  screen: string;
  setScreen: (screen: string) => void;
};

const NAV_ITEMS = [
  { id: "hero", labelKey: "nav.home", icon: "★" },
  { id: "today", labelKey: "nav.today", icon: "✓" },
  { id: "training", labelKey: "nav.train", icon: "◆" },
  { id: "nutrition", labelKey: "nav.food", icon: "◇" },
  { id: "more", labelKey: "nav.more", icon: "☰" },
] as const;

export default function BottomNav({ screen, setScreen }: Props) {
  const { t } = useTranslation();

  const activeIndex = useMemo(
    () => Math.max(0, NAV_ITEMS.findIndex((item) => item.id === screen)),
    [screen]
  );

  const handleSelect = (name: string) => {
    if (screen !== name) {
      hapticTab();
      setScreen(name);
    }
  };

  const tabWidthPercent = 100 / NAV_ITEMS.length;

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-40 iron-nav-glass pb-[env(safe-area-inset-bottom)]"
      aria-label={t("nav.ariaLabel")}
    >
      <div className="relative max-w-md mx-auto flex justify-around items-stretch px-1">
        <span
          className={`pointer-events-none absolute top-0 h-0.5 rounded-full bg-iron-accent iron-nav-active-indicator ${tabIndicatorMotion}`}
          style={{
            width: `${tabWidthPercent}%`,
            left: `${activeIndex * tabWidthPercent}%`,
          }}
          aria-hidden="true"
        />

        {NAV_ITEMS.map(({ id, labelKey, icon }) => {
          const isActive = screen === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[60px] min-w-[52px] py-2 px-1 text-[10px] font-semibold tracking-wide iron-interactive iron-nav-tab-label ${
                isActive ? "text-iron-accent" : "text-iron-muted"
              }`}
            >
              <span
                className={`iron-nav-tab-icon text-base leading-none transition-transform duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-out)] ${
                  isActive ? "text-iron-accent scale-105" : ""
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
