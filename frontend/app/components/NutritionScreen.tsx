"use client";

import { useState } from "react";
import WeightProgressScreen from "./WeightProgressScreen";
import { useNutritionMissions, type NutritionMissionId } from "../hooks/useNutritionMissions";
import {
  getTranslatedNutritionTips,
  translateGoal,
  translateNutritionMission,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

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
  const { t } = useTranslation();
  const [view, setView] = useState<"nutrition" | "weight">("nutrition");
  const { missions, completeMission, completedCount, totalCount, progress } =
    useNutritionMissions();

  const tips = getTranslatedNutritionTips(goal, t);
  const goalLabel = translateGoal(goal, t);

  const missionButtonClass = (completed: boolean) =>
    `iron-interactive w-full border p-4 sm:p-5 flex justify-between items-center gap-3 font-semibold min-h-[52px] rounded-sm ${
      completed
        ? "bg-iron-raised text-iron-muted opacity-60 cursor-default border-iron-border"
        : "iron-card-panel cursor-pointer hover:border-iron-accent-dim/50 border-iron-border"
    }`;

  const shell = "mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24";

  if (view === "weight") {
    return (
      <div className={shell}>
        <div className="text-center">
          <p className="iron-label">{t("nutrition.bodyComposition")}</p>
          <h2 className="iron-heading text-3xl mt-2">{t("nutrition.weightProgress")}</h2>
          <p className="mt-2 text-sm text-iron-muted">{t("nutrition.weightSubtitle")}</p>
        </div>

        <WeightProgressScreen />

        <button
          type="button"
          className="w-full mt-6 iron-interactive iron-btn-secondary py-4 text-sm font-semibold rounded-sm"
          onClick={() => setView("nutrition")}
        >
          {t("nutrition.backToNutrition")}
        </button>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="text-center">
        <p className="iron-label">{t("nutrition.dailyDiscipline")}</p>
        <h2 className="iron-heading text-3xl mt-2">{t("nutrition.title")}</h2>
        <p className="mt-2 text-sm text-iron-muted">{t("nutrition.subtitle")}</p>
        <p className="mt-3 text-xs font-semibold text-iron-accent">
          {t("nutrition.goalLabel", { goal: goalLabel })}
        </p>
      </div>

      <div className="mt-8 iron-card-raised p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="iron-heading text-lg">{t("nutrition.checklist")}</h3>
          <p className="text-sm text-iron-muted">
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
                {translateNutritionMission(mission.id, t)}
              </span>
            </span>
            <span className="text-xs shrink-0 text-iron-gold">
              {mission.completed ? t("common.done") : t("common.tap")}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 iron-card-panel p-4">
        <h3 className="iron-heading text-lg text-iron-accent">{t("nutrition.coachTips")}</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-iron-muted">
          {tips.map((tip) => (
            <li
              key={tip}
              className="border-b border-iron-border pb-2 last:border-0 last:pb-0"
            >
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="w-full mt-6 iron-interactive iron-btn-secondary py-4 text-sm font-semibold rounded-sm"
        onClick={() => setView("weight")}
      >
        {t("nutrition.viewWeight")}
      </button>
    </div>
  );
}
