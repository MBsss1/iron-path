"use client";

import { useState } from "react";
import {
  ACTIVE_FITNESS_GOALS,
  type ActiveFitnessGoal,
} from "../data/fitnessGoals";
import { useTranslation } from "../i18n/useTranslation";
import GoalDetailsModal from "./GoalDetailsModal";

type Props = {
  selected: ActiveFitnessGoal;
  onSelect: (goal: ActiveFitnessGoal) => void;
};

export default function GoalSelectionCards({ selected, onSelect }: Props) {
  const { t } = useTranslation();
  const [detailsGoal, setDetailsGoal] = useState<ActiveFitnessGoal | null>(null);

  return (
    <>
      <div className="space-y-3">
        {ACTIVE_FITNESS_GOALS.map((goal) => {
          const isSelected = selected === goal;
          return (
            <div
              key={goal}
              className={`border p-4 rounded-sm ${
                isSelected
                  ? "border-iron-accent bg-iron-accent-dim/20"
                  : "border-iron-border iron-card-raised"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(goal)}
                className="w-full text-left iron-interactive"
              >
                <h3 className="iron-heading text-lg">{t(`goal.${goal}.title`)}</h3>
                <p className="text-sm text-iron-muted mt-2 leading-relaxed">
                  {t(`goal.${goal}.description`)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setDetailsGoal(goal)}
                className="mt-3 text-xs font-bold uppercase text-iron-accent-dim hover:text-iron-accent"
              >
                {t("goal.detailsButton")}
              </button>
            </div>
          );
        })}
      </div>
      <GoalDetailsModal goal={detailsGoal} onClose={() => setDetailsGoal(null)} />
    </>
  );
}
