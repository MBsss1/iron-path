"use client";

import { useState } from "react";
import Stagger from "../animations/Stagger";
import AnimatedProgressFill from "../animations/AnimatedProgressFill";
import WeightProgressScreen from "./WeightProgressScreen";
import NutritionAssessmentScreen from "./NutritionAssessmentScreen";
import { normalizeFitnessGoal } from "../data/fitnessGoals";
import type { MassGainAssessmentAnswers } from "../data/nutritionAssessment";
import type { WeightLossAssessmentAnswers } from "../data/nutritionWeightLossAssessment";
import { useNutritionAssessment } from "../hooks/useNutritionAssessment";
import { useNutritionMissions, type NutritionMissionId } from "../hooks/useNutritionMissions";
import type { Profile } from "../hooks/useProfile";
import {
  getTranslatedNutritionTips,
  translateGoal,
  translateNutritionMission,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import { track } from "../utils/analytics";

const MASS_GAIN_INFO_URL = "https://t.me/+8hucRbt1aLVhMGNi";
const WEIGHT_LOSS_INFO_URL = "https://t.me/+LIUoCz3TJbY5NGFi";

type Props = {
  goal?: string;
  profile: Profile | null;
  onProfileUpdate: (profile: Profile) => void;
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

export default function NutritionScreen({
  goal,
  profile,
  onProfileUpdate,
}: Props) {
  const { t } = useTranslation();
  const [view, setView] = useState<"nutrition" | "weight">("nutrition");
  const normalizedGoal = normalizeFitnessGoal(goal);
  const isMassGain = normalizedGoal === "mass_gain";
  const isWeightLoss = normalizedGoal === "weight_loss";
  const needsAssessment = isMassGain || isWeightLoss;

  const {
    loaded: assessmentLoaded,
    isComplete: assessmentComplete,
    level: nutritionLevel,
    complete: completeAssessment,
  } = useNutritionAssessment(profile, goal);

  const { missions, completeMission, completedCount, totalCount, progress } =
    useNutritionMissions(needsAssessment ? nutritionLevel : null);

  const tips = getTranslatedNutritionTips(goal, t);
  const goalLabel = translateGoal(goal, t);

  const missionButtonClass = (completed: boolean) =>
    `iron-interactive w-full border p-4 sm:p-5 flex justify-between items-center gap-3 font-semibold min-h-[52px] rounded-sm ${
      completed
        ? "bg-iron-raised text-iron-muted opacity-60 cursor-default border-iron-border"
        : "iron-card-panel cursor-pointer hover:border-iron-accent-dim/50 border-iron-border"
    }`;

  const shell = "mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24";

  const handleAssessmentComplete = (
    answers: MassGainAssessmentAnswers | WeightLossAssessmentAnswers
  ) => {
    const result = completeAssessment(answers);
    track("nutrition_test_completed", {
      level: result.level,
      diagnosis: result.diagnosis,
    });
    if (profile) {
      onProfileUpdate({
        ...profile,
        nutritionLevel: result.level,
        nutritionAssessmentCompletedAt: new Date().toISOString(),
      });
    }
  };

  if (needsAssessment && assessmentLoaded && !assessmentComplete) {
    return (
      <NutritionAssessmentScreen
        variant={isMassGain ? "mass_gain" : "weight_loss"}
        onComplete={handleAssessmentComplete}
      />
    );
  }

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
    <Stagger className={shell}>
      <div className="text-center">
        {!needsAssessment && (
          <p className="iron-label">{t("nutrition.dailyDiscipline")}</p>
        )}
        <h2
          className={`iron-heading text-3xl ${isMassGain ? "" : "mt-2"}`}
        >
          {t("nutrition.title")}
        </h2>
        <p className="mt-2 text-sm text-iron-muted leading-relaxed px-1">
          {isMassGain
            ? t("nutrition.subtitleMassGain")
            : isWeightLoss
              ? t("nutrition.subtitleWeightLoss")
              : t("nutrition.subtitle")}
        </p>
        <p className="mt-3 text-xs font-semibold text-iron-accent">
          {t("nutrition.goalLabel", { goal: goalLabel })}
        </p>
        {isMassGain && (
          <a
            href={MASS_GAIN_INFO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="iron-nutrition-info-link inline-flex items-center justify-center min-h-[44px] mt-2 px-2 text-sm font-semibold text-iron-accent underline underline-offset-[5px] decoration-iron-accent-dim hover:text-iron-text hover:decoration-iron-accent transition-colors"
          >
            {t("nutrition.sectionInfoLinkMassGain")}
          </a>
        )}
        {isWeightLoss && (
          <a
            href={WEIGHT_LOSS_INFO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="iron-nutrition-info-link inline-flex items-center justify-center min-h-[44px] mt-2 px-2 text-sm font-semibold text-iron-accent underline underline-offset-[5px] decoration-iron-accent-dim hover:text-iron-text hover:decoration-iron-accent transition-colors"
          >
            {t("nutrition.sectionInfoLinkWeightLoss")}
          </a>
        )}
      </div>

      <div className="mt-8 iron-card-raised p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="iron-heading text-lg">{t("nutrition.checklist")}</h3>
          <p className="text-sm text-iron-muted shrink-0">
            {completedCount} / {totalCount}
          </p>
        </div>

        <div className="w-full h-4 iron-progress-track overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={progress} />
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
            <span className="flex items-center gap-3 text-left min-w-0">
              <span className="text-lg shrink-0" aria-hidden="true">
                {getMissionIcon(mission.id)}
              </span>
              <span className="truncate sm:whitespace-normal">
                {mission.completed ? "✓ " : ""}
                {translateNutritionMission(
                  mission.id,
                  t,
                  needsAssessment ? nutritionLevel : null
                )}
              </span>
            </span>
            <span className="text-xs shrink-0 text-iron-gold">
              {mission.completed ? t("common.done") : t("common.tap")}
            </span>
          </button>
        ))}
      </div>

      {!needsAssessment && (
        <div className="mt-6 iron-card-panel p-4">
          <h3 className="iron-heading text-lg text-iron-accent">
            {t("nutrition.coachTips")}
          </h3>
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
      )}

      <button
        type="button"
        className="w-full mt-6 iron-interactive iron-btn-secondary py-4 text-sm font-semibold rounded-sm"
        onClick={() => setView("weight")}
      >
        {t("nutrition.viewWeight")}
      </button>
    </Stagger>
  );
}
