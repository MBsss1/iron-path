"use client";

import { hapticTab } from "../utils/haptics";

type Props = {
  screen: string;
  setScreen: (screen: string) => void;
};

const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: "★" },
  { id: "today", label: "Today", icon: "✓" },
  { id: "training", label: "Train", icon: "💪" },
  { id: "nutrition", label: "Food", icon: "🍖" },
  { id: "more", label: "More", icon: "⋮" },
] as const;

export default function BottomNav({ screen, setScreen }: Props) {
  const handleSelect = (name: string) => {
    if (screen !== name) {
      hapticTab();
      setScreen(name);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-40 bg-black border-t-4 border-[#b22222] pb-[env(safe-area-inset-bottom)]"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto flex justify-around items-stretch px-1">
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const isActive = screen === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative flex flex-col items-center justify-center flex-1
                min-h-[64px] min-w-[56px] py-2 px-2
                uppercase text-xs font-bold tracking-wider
                transition-all duration-200 ease-out
                active:scale-95
                ${isActive ? "text-[#b22222]" : "text-[#efe3c2]"}
              `}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-2 right-2 h-1 bg-[#b22222] rounded-full animate-nav-indicator origin-center"
                  aria-hidden="true"
                />
              )}

              <span
                className={`text-xl leading-none transition-transform duration-200 ${
                  isActive ? "scale-110" : "scale-100"
                }`}
              >
                {icon}
              </span>

              <span
                className={`mt-1 transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              >
                {label}
              </span>

              {isActive && (
                <span
                  className="absolute inset-x-3 bottom-1 h-8 bg-[#b22222]/10 rounded-md -z-10"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
