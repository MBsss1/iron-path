"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClassId } from "../data/classes";
import type { GeneratedExercise, GeneratedWorkout } from "../data/workoutGeneratorV2";
import { getWorkoutXp } from "../data/xpRewards";
import { translateDayType, translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import type { Profile } from "../hooks/useProfile";
import { applyClassXpBonus } from "../utils/classBonuses";
import { migrateProfile } from "../utils/migrations";
import {
  advanceAfterWorkoutLogged,
  buildCalendarDays,
  buildWeekPlanForProfile,
  getTodayWorkout,
  loadTrainingCalendarState,
  saveTrainingCalendarState,
  syncCalendarIfWorkoutMissionDone,
  type CalendarDay,
  type TrainingCalendarState,
} from "../utils/trainingCalendar";
import { safeGet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { getExerciseInfo } from "../data/exerciseLibrary";
import type { AssessmentInput, AssessmentResult } from "../data/fitnessAssessment";
import TrainingReasoningBlock from "./coaching/TrainingReasoningBlock";
import NextMilestoneBlock from "./coaching/NextMilestoneBlock";
import ReassessmentPromptBlock from "./coaching/ReassessmentPromptBlock";
import { getPathModeFromProfile } from "../data/pathMode";
import ExerciseDetailModal from "./ExerciseDetailModal";

type Props = {
  onCompleteWorkout: () => void;
  onCompleteWeek: () => void;
  program: { phase: string; week: number; goal?: string };
  classId?: ClassId | string | null;
  level: number;
  assessmentComplete: boolean;
  onStartAssessment: () => void;
  assessmentInput?: AssessmentInput | null;
  assessmentResult?: AssessmentResult | null;
  showReassessmentPrompt?: boolean;
  onRetakeAssessment?: () => void;
  onDismissReassessment?: () => void;
};

function isWorkoutMissionCompletedToday(): boolean {
  const saved = safeGet<{ date: string; missions: { id: string; completed: boolean }[] } | null>(
    STORAGE_KEYS.dailyMissions,
    null
  );
  const today = new Date().toDateString();
  if (saved?.date !== today || !saved.missions) return false;
  return saved.missions.find((m) => m.id === "workout")?.completed ?? false;
}

type Lang = "en" | "ru";

function pickLang(locale: string): Lang {
  return locale === "ru" ? "ru" : "en";
}

function WorkoutBlockView({
  block,
  lang,
  blockTitle,
  onOpenExercise,
  detailsLabel,
}: {
  block: { title: { en: string; ru: string }; items: GeneratedExercise[] };
  lang: Lang;
  blockTitle?: string;
  onOpenExercise: (exerciseId: string) => void;
  detailsLabel: string;
}) {
  if (block.items.length === 0) return null;

  return (
    <div className="border border-iron-border p-4 iron-card-panel rounded-sm">
      <p className="iron-label">
        {blockTitle ?? block.title[lang]}
      </p>
      <ul className="mt-3 space-y-3">
        {block.items.map((item) => {
          const hasDetails = Boolean(getExerciseInfo(item.exerciseId));

          return (
            <li
              key={item.exerciseId}
              className="border-b border-iron-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-iron-text font-medium">{item.name[lang]}</span>
                <span className="text-iron-muted shrink-0 text-right">
                  {item.prescription[lang]}
                </span>
              </div>
              {hasDetails && (
                <button
                  type="button"
                  onClick={() => onOpenExercise(item.exerciseId)}
                  className="mt-1.5 text-xs font-semibold text-iron-accent hover:text-iron-text iron-interactive"
                >
                  {detailsLabel}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TodayWorkoutView({
  workout,
  lang,
  t,
  onOpenExercise,
}: {
  workout: GeneratedWorkout;
  lang: Lang;
  t: (key: string, params?: Record<string, string | number>) => string;
  onOpenExercise: (exerciseId: string) => void;
}) {
  const detailsLabel = t("exerciseLibrary.details");

  return (
    <div className="space-y-3">
      <p className="text-xs text-iron-muted text-center">
        {t("training.estimatedMinutes", { minutes: workout.estimatedMinutes })}
      </p>
      <WorkoutBlockView
        block={workout.blocks.warmup}
        lang={lang}
        onOpenExercise={onOpenExercise}
        detailsLabel={detailsLabel}
      />
      <WorkoutBlockView
        block={workout.blocks.mainWork}
        lang={lang}
        onOpenExercise={onOpenExercise}
        detailsLabel={detailsLabel}
      />
      {workout.blocks.accessoryWork.items.length > 0 && (
        <WorkoutBlockView
          block={workout.blocks.accessoryWork}
          lang={lang}
          blockTitle={t("training.accessory")}
          onOpenExercise={onOpenExercise}
          detailsLabel={detailsLabel}
        />
      )}
      {workout.blocks.conditioning && workout.blocks.conditioning.items.length > 0 && (
        <WorkoutBlockView
          block={workout.blocks.conditioning}
          lang={lang}
          blockTitle={t("training.conditioning")}
          onOpenExercise={onOpenExercise}
          detailsLabel={detailsLabel}
        />
      )}
      <WorkoutBlockView
        block={workout.blocks.cooldown}
        lang={lang}
        onOpenExercise={onOpenExercise}
        detailsLabel={detailsLabel}
      />
    </div>
  );
}

function PlanTimeline({
  days,
  t,
}: {
  days: CalendarDay[];
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="space-y-1.5">
      {days.map((day) => {
        const icon = t(`training.statusIcon.${day.status}`);
        const slotLabel = t("training.planSlot", {
          current: day.dayIndex + 1,
          total: 7,
        });
        const label = translateDayType(day.dayType, t);

        return (
          <div
            key={day.dayIndex}
            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium ${
              day.status === "current"
                ? "bg-iron-accent/15 border border-iron-accent-dim/50 text-iron-text"
                : day.status === "completed"
                  ? "text-iron-muted opacity-80"
                  : "text-iron-muted"
            }`}
          >
            <span className="w-5 text-center shrink-0" aria-hidden="true">
              {icon}
            </span>
            <span className="w-[7.5rem] shrink-0 font-bold tracking-wide">
              {slotLabel}
            </span>
            <span className="flex-1 truncate">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function TrainingScreen({
  onCompleteWorkout,
  onCompleteWeek,
  program,
  classId,
  level,
  assessmentComplete,
  onStartAssessment,
  assessmentInput = null,
  assessmentResult = null,
  showReassessmentPrompt = false,
  onRetakeAssessment,
  onDismissReassessment,
}: Props) {
  const { t, locale } = useTranslation();
  const lang = pickLang(locale);
  const seasonWeek = program.week;

  const [detailExerciseId, setDetailExerciseId] = useState<string | null>(null);
  const detailExercise = detailExerciseId
    ? getExerciseInfo(detailExerciseId) ?? null
    : null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [calendarState, setCalendarState] = useState<TrainingCalendarState>(() =>
    loadTrainingCalendarState(seasonWeek)
  );
  const [workoutLoggedToday, setWorkoutLoggedToday] = useState(false);

  useEffect(() => {
    setProfile(migrateProfile());
    setWorkoutLoggedToday(isWorkoutMissionCompletedToday());
  }, []);

  useEffect(() => {
    let state = loadTrainingCalendarState(seasonWeek);
    if (isWorkoutMissionCompletedToday()) {
      state = syncCalendarIfWorkoutMissionDone(state, true);
      saveTrainingCalendarState(state);
    }
    setCalendarState(state);
    setWorkoutLoggedToday(isWorkoutMissionCompletedToday());
  }, [seasonWeek]);

  const weekPlan = useMemo(
    () => buildWeekPlanForProfile(profile),
    [profile]
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(weekPlan, calendarState),
    [weekPlan, calendarState]
  );

  const todayWorkout = useMemo(
    () => getTodayWorkout(profile, weekPlan, calendarState.activeDayIndex),
    [profile, weekPlan, calendarState.activeDayIndex]
  );

  const pathMode = getPathModeFromProfile(profile);

  const todayDayType = weekPlan.days[calendarState.activeDayIndex]?.dayType;
  const todayTitle = todayDayType
    ? translateDayType(todayDayType, t)
    : todayWorkout.title[lang];

  const workoutXp = applyClassXpBonus(
    getWorkoutXp(program.phase),
    classId,
    "workout",
    level
  );

  const handleLogWorkout = useCallback(() => {
    if (workoutLoggedToday) return;

    onCompleteWorkout();
    const next = advanceAfterWorkoutLogged(calendarState);
    saveTrainingCalendarState(next);
    setCalendarState(next);
    setWorkoutLoggedToday(true);
  }, [workoutLoggedToday, onCompleteWorkout, calendarState]);

  const handleCompleteWeek = useCallback(() => {
    onCompleteWeek();
  }, [onCompleteWeek]);

  const activeSlot = calendarState.activeDayIndex + 1;

  if (!assessmentComplete) {
    return (
      <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24 text-center space-y-5">
        <h2 className="iron-heading text-2xl sm:text-3xl">{t("training.screenTitle")}</h2>
        <p className="text-sm text-iron-muted leading-relaxed max-w-sm mx-auto">
          {t("training.lockedUntilAssessment")}
        </p>
        <button
          type="button"
          onClick={onStartAssessment}
          className="iron-interactive iron-btn-primary w-full max-w-sm mx-auto py-4 text-base font-semibold min-h-[56px] rounded-sm"
        >
          {t("training.startAssessment")}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24 space-y-5">
      <div className="text-center">
        <p className="iron-label text-iron-accent">{t("training.screenTitle")}</p>
        <h2 className="iron-heading text-2xl sm:text-3xl mt-1">{todayTitle}</h2>
        <p className="mt-2 text-sm text-iron-muted">
          {t("training.planSlot", { current: activeSlot, total: 7 })}
          {" · "}
          {t("training.estimatedMinutes", {
            minutes: todayWorkout.estimatedMinutes,
          })}
        </p>
        <p className="mt-1 text-xs text-iron-muted">
          {t("training.phaseContext", {
            phase: translatePhase(program.phase, t),
            week: seasonWeek,
          })}
        </p>
      </div>

      {assessmentInput && assessmentResult && (
        <TrainingReasoningBlock
          input={assessmentInput}
          result={assessmentResult}
          dayType={todayDayType}
        />
      )}

      {assessmentInput && (
        <NextMilestoneBlock
          input={assessmentInput}
          pathMode={pathMode}
          emphasis={pathMode === "sport" ? "physical" : "balanced"}
        />
      )}

      {showReassessmentPrompt && onRetakeAssessment && onDismissReassessment && (
        <ReassessmentPromptBlock
          onRetake={onRetakeAssessment}
          onDismiss={onDismissReassessment}
        />
      )}

      <section className="border border-iron-accent-dim/50 bg-iron-panel p-4 rounded-sm space-y-4">
        <TodayWorkoutView
          workout={todayWorkout}
          lang={lang}
          t={t}
          onOpenExercise={setDetailExerciseId}
        />

        <ExerciseDetailModal
          exercise={detailExercise}
          isOpen={detailExercise !== null}
          onClose={() => setDetailExerciseId(null)}
        />

        {workoutLoggedToday ? (
          <p className="text-center text-sm font-semibold text-iron-accent py-3 border border-iron-border rounded-sm bg-iron-raised">
            {t("training.logWorkoutDone")}
          </p>
        ) : (
          <>
            <p className="text-sm text-iron-muted text-center leading-relaxed">
              {t("training.logWorkoutExplain")}
            </p>
            <p className="text-xs text-iron-muted text-center">
              {t("training.logWorkoutReward", { xp: workoutXp })}
            </p>
            <button
              type="button"
              onClick={handleLogWorkout}
              className="iron-interactive iron-btn-primary w-full py-4 text-base font-semibold min-h-[56px] rounded-sm"
            >
              {t("training.logWorkout")}
            </button>
          </>
        )}
      </section>

      <section className="border border-iron-border p-4 iron-card-raised rounded-sm">
        <h3 className="iron-heading text-lg mb-1">{t("training.planProgressTitle")}</h3>
        <p className="text-xs text-iron-muted mb-3">{t("training.planProgressHint")}</p>
        <PlanTimeline days={calendarDays} t={t} />
      </section>

      <button
        type="button"
        onClick={handleCompleteWeek}
        className="iron-interactive iron-btn-secondary w-full py-3 text-sm font-semibold rounded-sm"
      >
        {t("training.completeWeek")}
      </button>
    </div>
  );
}
