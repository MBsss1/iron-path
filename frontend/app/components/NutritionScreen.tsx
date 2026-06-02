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
    `w-full border-2 border-black p-4 sm:p-5 flex justify-between items-center gap-3 uppercase font-bold min-h-[52px] ${
      completed
        ? "bg-[#e8d8b0] text-black opacity-60 cursor-default"
        : "bg-black text-[#efe3c2] cursor-pointer"
    }`;

  if (view === "weight") {
    return (
      <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
        <div className="text-center">
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            Body Composition
          </p>

          <h2 className="text-4xl font-black uppercase mt-2">
            Weight Progress
          </h2>

          <p className="mt-2 uppercase text-sm">
            Track weight changes and goals
          </p>
        </div>

        <WeightProgressScreen />

        <button
          type="button"
          className="w-full mt-6 bg-[#333] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest hover:bg-black"
          onClick={() => setView("nutrition")}
        >
          Back to Nutrition
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Daily Discipline
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          Nutrition
        </h2>

        <p className="mt-2 uppercase text-sm">
          Simple habits. No calorie math.
        </p>

        <p className="mt-3 uppercase text-xs font-bold tracking-wider">
          Goal: {goalLabel}
        </p>
      </div>

      <div className="mt-8 border-2 border-black p-4 bg-[#e8d8b0]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black uppercase">Today&apos;s Checklist</h3>
          <p className="text-sm font-bold uppercase">
            {completedCount} / {totalCount}
          </p>
        </div>

        <div className="w-full h-4 border-2 border-black bg-[#f5ead0]">
          <div
            className="h-full bg-[#b22222] transition-all duration-300"
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
            <span className="text-xs shrink-0">
              {mission.completed ? "Done" : "Tap"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-black text-[#efe3c2]">
        <h3 className="text-xl font-black uppercase">Coach Tips</h3>
        <ul className="mt-3 space-y-2 text-sm uppercase leading-relaxed">
          {tips.map((tip) => (
            <li key={tip} className="border-b border-[#efe3c2]/30 pb-2 last:border-0 last:pb-0">
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="w-full mt-6 bg-[#333] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest hover:bg-black"
        onClick={() => setView("weight")}
      >
        View Weight Progress
      </button>
    </div>
  );
}
