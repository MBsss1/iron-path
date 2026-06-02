"use client";

import { useState } from "react";
import WeightProgressScreen from "./WeightProgressScreen";
import { useNutritionMissions, type NutritionMissionId } from "../hooks/useNutritionMissions";
import { getNutritionGoalLabel, getNutritionTips } from "../data/nutritionTips";

type Props = {
  goal?: string;
};

function getMissionIcon(id: NutritionMissionId): string {
  switch (id) {
    case "protein_target":
      return "🍖";
    case "meals_3_plus":
      return "🍽";
    case "water_2l":
      return "💧";
    case "no_junk":
      return "🚫";
    default:
      return "•";
  }
}

export default function NutritionScreen({ goal }: Props) {
  const [view, setView] = useState<"nutrition" | "weight">("nutrition");
  const { missions, completeMission, completedCount, totalCount, progress } =
    useNutritionMissions();

  const tips = getNutritionTips(goal);
  const goalLabel = getNutritionGoalLabel(goal);

  const missionButtonClass = (completed: boolean) =>
    `iron-interactive w-full border p-4 sm:p-5 flex justify-between items-center gap-3 uppercase font-bold min-h-[52px] ${
      completed
        ? "bg-iron-raised text-iron-muted opacity-60 cursor-default border-iron-border"
        : "iron-card-panel cursor-pointer hover:border-iron-accent-dim/50 border-iron-border"
    }`;

  const shell = "mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24";

  if (view === "weight") {
    return (
      <div className={shell}>
        <div className="text-center">
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Body Composition
          </p>

          <h2 className="text-4xl font-black uppercase mt-2 text-iron-text">
            Weight Progress
          </h2>

          <p className="mt-2 uppercase text-sm text-iron-muted">
            Track weight changes and goals
          </p>
        </div>

        <WeightProgressScreen />

        <button
          type="button"
          className="w-full mt-6 bg-iron-panel text-iron-cream border border-iron-border-strong py-4 uppercase font-black tracking-widest hover:border-iron-gold-dim animate-button-press"
          onClick={() => setView("nutrition")}
        >
          Back to Nutrition
        </button>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
          Daily Discipline
        </p>

        <h2 className="text-4xl font-black uppercase mt-2 text-iron-text">
          Nutrition
        </h2>

        <p className="mt-2 uppercase text-sm text-iron-muted">
          Simple habits. No calorie math.
        </p>

        <p className="mt-3 uppercase text-xs font-bold tracking-wider text-iron-gold">
          Goal: {goalLabel}
        </p>
      </div>

      <div className="mt-8 iron-card-raised p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black uppercase text-iron-text">
            Today&apos;s Checklist
          </h3>
          <p className="text-sm font-bold uppercase text-iron-muted">
            {completedCount} / {totalCount}
          </p>
        </div>

        <div className="w-full h-4 iron-progress-track overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {missions.map((mission) => (
          <button
            key={mission.id}
            type="button"
            disabled={mission.completed}
            onClick={() => completeMission(mission.id)}
            className={missionButtonClass(mission.completed)}
          >
            <span className="flex items-center gap-3 text-left">
              <span className="text-lg" aria-hidden="true">
                {getMissionIcon(mission.id)}
              </span>
              <span>
                {mission.completed ? "✓ " : ""}
                {mission.name}
              </span>
            </span>
            <span className="text-xs shrink-0 text-iron-gold">
              {mission.completed ? "Done" : "Tap"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 iron-card-panel p-4">
        <h3 className="text-xl font-black uppercase text-iron-gold">Coach Tips</h3>
        <ul className="mt-3 space-y-2 text-sm uppercase leading-relaxed text-iron-muted">
          {tips.map((tip) => (
            <li
              key={tip}
              className="border-b border-iron-border pb-2 last:border-0 last:pb-0 normal-case"
            >
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="w-full mt-6 bg-iron-charcoal text-iron-cream border border-iron-border-strong py-4 uppercase font-black tracking-widest hover:border-iron-gold-dim animate-button-press"
        onClick={() => setView("weight")}
      >
        View Weight Progress
      </button>
    </div>
  );
}
