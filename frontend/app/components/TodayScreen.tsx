"use client";

import { useMemo } from "react";
import type { ClassId } from "../data/classes";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import { applyClassXpBonus } from "../utils/classBonuses";
import type { DailyMission } from "../hooks/useDailyMissions";
import { translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  program: any;
  classId?: ClassId | string | null;
  level: number;
  missions: DailyMission[];
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
  onGoToTraining: () => void;
};

export default function TodayScreen({
  program,
  classId,
  level,
  missions,
  onCompleteDeepWork,
  onCompleteProtein,
  onCompleteSleep,
  onGoToTraining,
}: Props) {
  const { t } = useTranslation();

  const isCompleted = (id: DailyMission["id"]) =>
    missions.find((mission) => mission.id === id)?.completed ?? false;

  const deepWorkXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.deepWork, classId, "deepWork", level),
    [classId, level]
  );
  const proteinXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.protein, classId, "mission", level),
    [classId, level]
  );
  const sleepXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.sleep, classId, "mission", level),
    [classId, level]
  );
  const workoutXp = useMemo(
    () =>
      applyClassXpBonus(getWorkoutXp(program.phase), classId, "workout", level),
    [program.phase, classId, level]
  );

  const tryComplete = (id: DailyMission["id"], action: () => void) => {
    if (isCompleted(id)) return;
    action();
  };

  const taskClass = (id: DailyMission["id"]) =>
    `iron-interactive w-full border border-iron-border p-4 sm:p-5 flex justify-between font-semibold cursor-pointer min-h-[52px] rounded-sm ${
      isCompleted(id)
        ? "bg-iron-raised text-iron-muted opacity-60"
        : "iron-card-panel hover:border-iron-accent-dim/50"
    }`;

  const deepWorkDone = isCompleted("deepwork");
  const proteinDone = isCompleted("protein");
  const sleepDone = isCompleted("sleep");
  const workoutDone = isCompleted("workout");

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
      <h2 className="iron-heading text-3xl text-center">{t("today.title")}</h2>

      <div className="mt-4 text-center text-sm text-iron-muted">
        <p className="font-semibold text-iron-accent">
          {translatePhase(program.phase, t)}
        </p>
        <p>{t("today.week", { week: program.week })}</p>
      </div>

      {!workoutDone && (
        <div className="mt-6 border border-iron-accent-dim/60 bg-iron-panel p-4 rounded-sm">
          <p className="text-sm text-iron-text leading-relaxed">
            {t("today.workoutHint")}
          </p>
          <button
            type="button"
            onClick={onGoToTraining}
            className="iron-interactive iron-btn-primary w-full mt-3 py-2.5 text-sm font-semibold rounded-sm"
          >
            {t("today.goToTraining")}
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="border border-iron-border p-4 iron-card-raised rounded-sm">
          <div className="flex justify-between items-baseline gap-2 mb-3">
            <p className="iron-label">{t("today.workoutPlanTitle")}</p>
            <span className="text-xs text-iron-gold">
              +{workoutXp} {t("common.xp")}
            </span>
          </div>
          <p className="text-xs text-iron-muted mb-3">
            {workoutDone ? t("today.workoutPlanDone") : t("today.workoutPlanNote")}
          </p>
          <ul className="space-y-2 text-sm text-iron-text">
            {program.workouts?.map((workout: string, index: number) => (
              <li
                key={index}
                className="flex justify-between border-b border-iron-border pb-2 last:border-0 last:pb-0"
              >
                <span>{workoutDone ? "✓ " : "· "}{workout}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => tryComplete("deepwork", onCompleteDeepWork)}
          disabled={deepWorkDone}
          className={taskClass("deepwork")}
        >
          <span>
            {deepWorkDone ? t("today.deepWorkDone") : t("today.deepWork")}
          </span>
          <span className="text-iron-gold">+{deepWorkXp} {t("common.xp")}</span>
        </button>

        <button
          type="button"
          onClick={() => tryComplete("protein", onCompleteProtein)}
          disabled={proteinDone}
          className={taskClass("protein")}
        >
          <span>{proteinDone ? t("today.proteinDone") : t("today.protein")}</span>
          <span className="text-iron-gold">+{proteinXp} {t("common.xp")}</span>
        </button>

        <button
          type="button"
          onClick={() => tryComplete("sleep", onCompleteSleep)}
          disabled={sleepDone}
          className={taskClass("sleep")}
        >
          <span>{sleepDone ? t("today.sleepDone") : t("today.sleep")}</span>
          <span className="text-iron-gold">+{sleepXp} {t("common.xp")}</span>
        </button>
      </div>
    </div>
  );
}
