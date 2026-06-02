"use client";

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

  const handleSelect = (name: string) => {
    if (screen !== name) {
      hapticTab();
      setScreen(name);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-40 iron-nav-glass pb-[env(safe-area-inset-bottom)]"
      aria-label={t("nav.ariaLabel")}
    >
      <div className="max-w-md mx-auto flex justify-around items-stretch px-1">
        {NAV_ITEMS.map(({ id, labelKey, icon }) => {
          const isActive = screen === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 min-h-[60px] min-w-[52px] py-2 px-1 text-[10px] font-semibold tracking-wide iron-interactive ${
                isActive ? "text-iron-accent" : "text-iron-muted"
              }`}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-3 right-3 h-0.5 iron-nav-active-indicator rounded-full animate-nav-indicator origin-center"
                  aria-hidden="true"
                />
              )}

              <span className={`text-base leading-none ${isActive ? "text-iron-accent" : ""}`}>
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
