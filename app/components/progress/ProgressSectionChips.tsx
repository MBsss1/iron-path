"use client";

import { useTranslation } from "../../i18n/useTranslation";

export type ProgressSectionId =
  | "overview"
  | "physical"
  | "strength"
  | "weight"
  | "achievements"
  | "history";

type Props = {
  active: ProgressSectionId;
  onChange: (id: ProgressSectionId) => void;
};

const SECTIONS: ProgressSectionId[] = [
  "overview",
  "physical",
  "strength",
  "weight",
  "achievements",
  "history",
];

export default function ProgressSectionChips({ active, onChange }: Props) {
  const { t } = useTranslation();

  const label = (id: ProgressSectionId) => {
    switch (id) {
      case "overview":
        return t("progressScreen.tabOverview");
      case "physical":
        return t("progressScreen.tabPhysical");
      case "strength":
        return t("progressScreen.tabStrength");
      case "weight":
        return t("progressScreen.tabWeight");
      case "achievements":
        return t("progressScreen.tabAchievements");
      case "history":
        return t("progressScreen.tabHistory");
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {SECTIONS.map((id) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`shrink-0 px-3 py-2 text-xs font-bold uppercase rounded-sm border transition-colors ${
              selected
                ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
                : "bg-iron-panel text-iron-muted border-iron-border hover:border-iron-accent-dim/50"
            }`}
          >
            {label(id)}
          </button>
        );
      })}
    </div>
  );
}
