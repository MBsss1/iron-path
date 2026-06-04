"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClassId } from "../data/classes";
import type { GeneratedExercise, GeneratedWorkout } from "../data/workoutGeneratorV2";
import { translateDayType, translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import type { Profile } from "../hooks/useProfile";
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
import {
  countSessionExercises,
  getWorkoutMainItems,
} from "../utils/trainingWorkoutView";
import { safeGet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { getExerciseInfo } from "../data/exerciseLibrary";
import type { AssessmentInput, AssessmentResult } from "../data/fitnessAssessment";
import TrainingReasoningBlock from "./coaching/TrainingReasoningBlock";
import NextMilestoneBlock from "./coaching/NextMilestoneBlock";
import ReassessmentPromptBlock from "./coaching/ReassessmentPromptBlock";
import { getPathModeFromProfile } from "../data/pathMode";
import ExerciseDetailModal from "./ExerciseDetailModal";
import TrainingTimer from "./TrainingTimer";
import TrainingExerciseCard from "./TrainingExerciseCard";
import RestTimerModal from "./RestTimerModal";

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

function TrainingSection({
  title,
  description,
  items,
  lang,
  onOpenExercise,
  onRestTimer,
}: {
  title: string;
  description: string;
  items: GeneratedExercise[];
  lang: Lang;
  onOpenExercise: (exerciseId: string) => void;
  onRestTimer: (exerciseId: string, restSeconds: number) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="border border-iron-border rounded-sm p-4 iron-card-panel space-y-4">
      <div>
        <h3 className="iron-heading text-lg">{title}</h3>
        <p className="text-sm text-iron-muted mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <TrainingExerciseCard
            key={`${item.exerciseId}-${item.prescription.en}`}
            item={item}
            lang={lang}
            onDetails={onOpenExercise}
            onRestTimer={onRestTimer}
          />
        ))}
      </div>
    </section>
  );
}

function AfterWorkoutNote({ t }: { t: (key: string) => string }) {
  return (
    <div className="border border-iron-border/80 rounded-sm p-4 bg-iron-panel/80">
      <p className="text-sm font-semibold text-iron-text">{t("training.afterWorkout.title")}</p>
      <p className="text-sm text-iron-muted mt-2 leading-relaxed">
        {t("training.afterWorkout.body")}
      </p>
    </div>
  );
}

function TodayWorkoutView({
  workout,
  lang,
  t,
  onOpenExercise,
  onRestTimer,
}: {
  workout: GeneratedWorkout;
  lang: Lang;
  t: (key: string, params?: Record<string, string | number>) => string;
  onOpenExercise: (exerciseId: string) => void;
  onRestTimer: (exerciseId: string, restSeconds: number) => void;
}) {
  const mainItems = getWorkoutMainItems(workout);

  return (
    <div className="space-y-4">
      <TrainingSection
        title={t("training.block.warmupTitle")}
        description={t("training.block.warmupDescription")}
        items={workout.blocks.warmup.items}
        lang={lang}
        onOpenExercise={onOpenExercise}
        onRestTimer={onRestTimer}
      />
      <TrainingSection
        title={t("training.block.workoutTitle")}
        description={t("training.block.workoutDescription")}
        items={mainItems}
        lang={lang}
        onOpenExercise={onOpenExercise}
        onRestTimer={onRestTimer}
      />
      <AfterWorkoutNote t={t} />
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
  classId: _classId,
  level: _level,
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

  const [restTimer, setRestTimer] = useState<{
    exerciseId: string;
    seconds: number;
    name: string;
  } | null>(null);

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

  const exerciseCount = useMemo(
    () => countSessionExercises(todayWorkout),
    [todayWorkout]
  );

  const handleOpenRestTimer = useCallback(
    (exerciseId: string, restSeconds: number) => {
      const item =
        todayWorkout.blocks.warmup.items.find((i) => i.exerciseId === exerciseId) ??
        getWorkoutMainItems(todayWorkout).find((i) => i.exerciseId === exerciseId);
      setRestTimer({
        exerciseId,
        seconds: restSeconds,
        name: item?.name[lang] ?? exerciseId,
      });
    },
    [todayWorkout, lang]
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
        </p>
        <p className="mt-1 text-xs text-iron-muted">
          {t("training.phaseContext", {
            phase: translatePhase(program.phase, t),
            week: seasonWeek,
          })}
        </p>
      </div>

      <TrainingTimer />

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
          onRestTimer={handleOpenRestTimer}
        />

        <ExerciseDetailModal
          exercise={detailExercise}
          isOpen={detailExercise !== null}
          onClose={() => setDetailExerciseId(null)}
        />

        <RestTimerModal
          isOpen={restTimer !== null}
          durationSeconds={restTimer?.seconds ?? 60}
          exerciseName={restTimer?.name ?? ""}
          onClose={() => setRestTimer(null)}
        />

        {workoutLoggedToday ? (
          <p className="text-center text-sm font-semibold text-iron-accent py-3 border border-iron-border rounded-sm bg-iron-raised">
            {t("training.logWorkoutDone")}
          </p>
        ) : (
          <>
            <div className="border border-iron-border rounded-sm p-4 bg-iron-raised/40 text-sm text-iron-muted space-y-1">
              <p className="font-semibold text-iron-text">{t("training.summary.title")}</p>
              <p>{t("training.summary.exercises", { count: exerciseCount })}</p>
              <p>
                {t("training.summary.minutes", {
                  minutes: todayWorkout.estimatedMinutes,
                })}
              </p>
            </div>
            <p className="text-sm text-iron-muted text-center leading-relaxed">
              {t("training.logWorkoutExplain")}
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
