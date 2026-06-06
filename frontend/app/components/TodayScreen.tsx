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
import Stagger from "../animations/Stagger";
import PlayerHud from "./rpg/PlayerHud";
import QuestCard from "./rpg/QuestCard";
import RewardChip from "./rpg/RewardChip";

type Props = {
  program: { phase: string; week: number };
  classId?: ClassId | string | null;
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  rank: string;
  missions: DailyMission[];
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
  assessmentComplete: boolean;
  onStartAssessment: () => void;
  onGoToTraining: () => void;
};

const HABIT_ICONS: Record<"deepwork" | "protein" | "sleep", string> = {
  deepwork: "🎯",
  protein: "🥩",
  sleep: "😴",
};

export default function TodayScreen({
  program,
  classId,
  level,
  xp,
  maxXp,
  streak,
  rank,
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

  const deepWorkDone = isCompleted("deepwork");
  const proteinDone = isCompleted("protein");
  const sleepDone = isCompleted("sleep");
  const workoutDone = isCompleted("workout");

  const workoutMeta = (
    <div className="space-y-1.5 text-xs sm:text-sm">
      <div className="flex justify-between gap-3 border-b border-iron-border pb-1.5">
        <span className="text-iron-muted">{t("today.dayTypeLabel")}</span>
        <span className="text-iron-text font-semibold text-right">{dayTypeLabel}</span>
      </div>
      <div className="flex justify-between gap-3 border-b border-iron-border pb-1.5">
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
          {workoutDone ? t("today.statusDone") : t("today.statusNotDone")}
        </span>
      </div>
    </div>
  );

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
      <PlayerHud
        level={level}
        xp={xp}
        maxXp={maxXp}
        streak={streak}
        rank={rank}
      />

      <h2 className="iron-heading text-3xl text-center mt-2">{t("today.title")}</h2>

      <div className="mt-4 text-center text-sm text-iron-muted">
        <p className="font-semibold text-iron-accent">
          {translatePhase(program.phase, t)}
        </p>
        <p>{t("today.week", { week: program.week })}</p>
      </div>

      <Stagger className="mt-6 space-y-4">
        {assessmentComplete ? (
          <QuestCard
            variant="main"
            icon="💪"
            title={t("today.todayWorkoutTitle")}
            meta={workoutMeta}
            reward={
              <RewardChip
                amount={workoutXp}
                variant={workoutDone ? "muted" : "gold"}
              />
            }
            status={workoutDone ? "completed" : "available"}
            actionLabel={workoutDone ? undefined : t("today.goToTraining")}
            onAction={workoutDone ? undefined : onGoToTraining}
          />
        ) : (
          <QuestCard
            variant="main"
            icon="🗺️"
            title={t("hero.pathNotFormedTitle")}
            subtitle={t("today.assessmentRequired")}
            actionLabel={t("hero.startAssessment")}
            onAction={onStartAssessment}
          />
        )}

        <p className="iron-label text-center">{t("today.habitsTitle")}</p>

        <div className="space-y-3">
          <QuestCard
            icon={HABIT_ICONS.deepwork}
            title={deepWorkDone ? t("today.deepWorkDone") : t("today.deepWork")}
            reward={
              <RewardChip
                amount={deepWorkXp}
                variant={deepWorkDone ? "muted" : "gold"}
              />
            }
            status={deepWorkDone ? "completed" : "available"}
            onAction={() => tryComplete("deepwork", onCompleteDeepWork)}
            disabled={deepWorkDone}
          />

          <QuestCard
            icon={HABIT_ICONS.protein}
            title={proteinDone ? t("today.proteinDone") : t("today.protein")}
            reward={
              <RewardChip
                amount={proteinXp}
                variant={proteinDone ? "muted" : "gold"}
              />
            }
            status={proteinDone ? "completed" : "available"}
            onAction={() => tryComplete("protein", onCompleteProtein)}
            disabled={proteinDone}
          />

          <QuestCard
            icon={HABIT_ICONS.sleep}
            title={sleepDone ? t("today.sleepDone") : t("today.sleep")}
            reward={
              <RewardChip
                amount={sleepXp}
                variant={sleepDone ? "muted" : "gold"}
              />
            }
            status={sleepDone ? "completed" : "available"}
            onAction={() => tryComplete("sleep", onCompleteSleep)}
            disabled={sleepDone}
          />
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
      </Stagger>
    </div>
  );
}
