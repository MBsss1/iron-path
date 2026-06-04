"use client";

import { useEffect, useMemo, useState } from "react";
import type { ClassId } from "../data/classes";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import { applyClassXpBonus } from "../utils/classBonuses";
import type { DailyMission } from "../hooks/useDailyMissions";
import { translateDayType, translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import type { Profile } from "../hooks/useProfile";
import { migrateProfile } from "../utils/migrations";
import { getPathModeFromProfile } from "../data/pathMode";
import {
  buildWeekPlanForProfile,
  getTodayWorkout,
  loadTrainingCalendarState,
} from "../utils/trainingCalendar";
import TodayPersonalTasksBlock from "./today/TodayPersonalTasksBlock";
import TodayHabitControlBlock from "./today/TodayHabitControlBlock";

type Props = {
  program: { phase: string; week: number };
  classId?: ClassId | string | null;
  level: number;
  missions: DailyMission[];
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
  assessmentComplete: boolean;
  onStartAssessment: () => void;
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
  assessmentComplete,
  onStartAssessment,
  onGoToTraining,
}: Props) {
  const { t, locale } = useTranslation();
  const lang = locale === "ru" ? "ru" : "en";
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(migrateProfile());
  }, []);

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

  const calendarState = useMemo(
    () => loadTrainingCalendarState(program.week),
    [program.week]
  );

  const weekPlan = useMemo(
    () => buildWeekPlanForProfile(profile),
    [profile]
  );

  const todayWorkout = useMemo(
    () => getTodayWorkout(profile, weekPlan, calendarState.activeDayIndex),
    [profile, weekPlan, calendarState.activeDayIndex]
  );

  const pathMode = getPathModeFromProfile(profile) ?? "balance";

  const todayDayType = weekPlan.days[calendarState.activeDayIndex]?.dayType;
  const dayTypeLabel = todayDayType
    ? translateDayType(todayDayType, t)
    : todayWorkout.title[lang];

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

      {assessmentComplete ? (
        <div className="mt-6 border border-iron-border p-4 iron-card-raised rounded-sm space-y-3">
          <div className="flex justify-between items-baseline gap-2">
            <p className="iron-label">{t("today.todayWorkoutTitle")}</p>
            <span className="text-xs text-iron-gold">
              +{workoutXp} {t("common.xp")}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3 border-b border-iron-border pb-2">
              <span className="text-iron-muted">{t("today.dayTypeLabel")}</span>
              <span className="text-iron-text font-semibold text-right">
                {dayTypeLabel}
              </span>
            </div>
            <div className="flex justify-between gap-3 border-b border-iron-border pb-2">
              <span className="text-iron-muted">{t("today.durationLabel")}</span>
              <span className="text-iron-text font-semibold">
                {t("training.estimatedMinutes", {
                  minutes: todayWorkout.estimatedMinutes,
                })}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-iron-muted">{t("today.statusLabel")}</span>
              <span
                className={
                  workoutDone
                    ? "text-iron-accent font-semibold"
                    : "text-iron-text font-semibold"
                }
              >
                {workoutDone
                  ? t("today.statusDone")
                  : t("today.statusNotDone")}
              </span>
            </div>
          </div>

          {!workoutDone && (
            <button
              type="button"
              onClick={onGoToTraining}
              className="iron-interactive iron-btn-primary w-full mt-1 py-2.5 text-sm font-semibold rounded-sm"
            >
              {t("today.goToTraining")}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 border border-iron-accent-dim/60 bg-iron-panel p-4 rounded-sm">
          <p className="text-sm text-iron-text leading-relaxed">
            {t("today.assessmentRequired")}
          </p>
          <button
            type="button"
            onClick={onStartAssessment}
            className="iron-interactive iron-btn-primary w-full mt-3 py-2.5 text-sm font-semibold rounded-sm"
          >
            {t("hero.startAssessment")}
          </button>
        </div>
      )}

      <p className="mt-4 iron-label text-center">{t("today.habitsTitle")}</p>

      <div className="mt-3 space-y-3">
        {assessmentComplete && (
          <div
            className={`w-full border border-iron-border p-4 sm:p-5 flex justify-between font-semibold min-h-[52px] rounded-sm ${
              workoutDone
                ? "bg-iron-raised text-iron-muted opacity-60"
                : "iron-card-panel"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={workoutDone ? "text-iron-accent" : "text-iron-border-strong"}>
                {workoutDone ? "✓" : "□"}
              </span>
              <span>
                {workoutDone
                  ? t("today.workoutHabitDone")
                  : t("today.workoutHabit")}
              </span>
            </span>
            <span className="text-iron-gold text-xs">
              {t("today.workoutHabitNote")}
            </span>
          </div>
        )}

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

      {pathMode === "self_development" && (
        <div className="mt-6 space-y-4">
          <TodayPersonalTasksBlock />
          <TodayHabitControlBlock />
        </div>
      )}

      {pathMode === "balance" && (
        <div className="mt-6">
          <TodayPersonalTasksBlock compact />
        </div>
      )}
    </div>
  );
}
