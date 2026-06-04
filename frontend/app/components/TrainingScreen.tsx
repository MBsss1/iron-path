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
  clearActiveTrainingSession,
  exerciseItemKey,
  loadActiveTrainingSession,
  saveActiveTrainingSession,
  type ActiveTrainingSession,
  type SessionScope,
  type TrainingStage,
} from "../utils/activeTrainingSession";
import { getWorkoutMainItems } from "../utils/trainingWorkoutView";
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
import RestTimerPanel from "./RestTimerPanel";
import Stagger from "../animations/Stagger";
import CompletionMoment from "./ui/CompletionMoment";

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

function countCompleted(items: GeneratedExercise[], completedIds: string[]): number {
  return items.filter((item) => completedIds.includes(exerciseItemKey(item))).length;
}

function TrainingStageBlock({
  stage,
  title,
  description,
  items,
  completedIds,
  lang,
  onToggleComplete,
  onOpenExercise,
  onOpenRest,
  t,
}: {
  stage: TrainingStage;
  title: string;
  description: string;
  items: GeneratedExercise[];
  completedIds: string[];
  lang: Lang;
  onToggleComplete: (key: string) => void;
  onOpenExercise: (id: string) => void;
  onOpenRest: (key: string, seconds: number, name: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const done = countCompleted(items, completedIds);
  const total = items.length;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="iron-heading text-xl">{title}</h3>
        <p className="text-sm text-iron-muted mt-1 leading-relaxed">{description}</p>
        {total > 0 && (
          <p className="text-xs font-semibold text-iron-accent mt-2">
            {t("training.flow.progress", { done, total })}
          </p>
        )}
      </div>
      <Stagger className="space-y-2">
        {items.map((item) => (
          <TrainingExerciseCard
            key={exerciseItemKey(item)}
            item={item}
            lang={lang}
            variant={stage === "warmup" ? "warmup" : "workout"}
            completed={completedIds.includes(exerciseItemKey(item))}
            onToggleComplete={onToggleComplete}
            onDetails={onOpenExercise}
            onOpenRest={onOpenRest}
          />
        ))}
      </Stagger>
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
  const todayDate = new Date().toDateString();

  const [detailExerciseId, setDetailExerciseId] = useState<string | null>(null);
  const detailExercise = detailExerciseId
    ? getExerciseInfo(detailExerciseId) ?? null
    : null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [calendarState, setCalendarState] = useState<TrainingCalendarState>(() =>
    loadTrainingCalendarState(seasonWeek)
  );
  const [workoutLoggedToday, setWorkoutLoggedToday] = useState(false);
  const [session, setSession] = useState<ActiveTrainingSession | null>(null);

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

  const sessionScope = useMemo<SessionScope>(
    () => ({
      date: todayDate,
      week: seasonWeek,
      dayIndex: calendarState.activeDayIndex,
      workoutId: todayWorkout.id,
    }),
    [todayDate, seasonWeek, calendarState.activeDayIndex, todayWorkout.id]
  );

  useEffect(() => {
    setSession(loadActiveTrainingSession(sessionScope));
  }, [sessionScope]);

  const patchSession = useCallback(
    (patch: Partial<ActiveTrainingSession>) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        saveActiveTrainingSession(next);
        return next;
      });
    },
    []
  );

  const warmupItems = todayWorkout.blocks.warmup.items;
  const workoutItems = useMemo(
    () => getWorkoutMainItems(todayWorkout),
    [todayWorkout]
  );

  const pathMode = getPathModeFromProfile(profile);
  const todayDayType = weekPlan.days[calendarState.activeDayIndex]?.dayType;
  const todayTitle = todayDayType
    ? translateDayType(todayDayType, t)
    : todayWorkout.title[lang];

  const activeStage = session?.activeStage ?? "warmup";
  const completedWarmup = session?.completedWarmupExerciseIds ?? [];
  const completedWorkout = session?.completedWorkoutExerciseIds ?? [];

  const warmupDoneCount = countCompleted(warmupItems, completedWarmup);
  const workoutDoneCount = countCompleted(workoutItems, completedWorkout);
  const allWarmupDone =
    warmupItems.length === 0 || warmupDoneCount >= warmupItems.length;
  const allWorkoutDone =
    workoutItems.length === 0 || workoutDoneCount >= workoutItems.length;
  const workoutRemaining = workoutItems.length - workoutDoneCount;

  const toggleWarmup = useCallback(
    (key: string) => {
      if (!session) return;
      const set = new Set(session.completedWarmupExerciseIds);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      patchSession({ completedWarmupExerciseIds: [...set] });
    },
    [session, patchSession]
  );

  const toggleWorkout = useCallback(
    (key: string) => {
      if (!session) return;
      const set = new Set(session.completedWorkoutExerciseIds);
      if (set.has(key)) set.delete(key);
      else set.add(key);
      patchSession({ completedWorkoutExerciseIds: [...set] });
    },
    [session, patchSession]
  );

  const handleGoToWorkout = () => {
    patchSession({ activeStage: "workout" });
  };

  const handleOpenRest = useCallback(
    (key: string, seconds: number, name: string) => {
      patchSession({
        restTimerState: {
          exerciseKey: key,
          exerciseName: name,
          durationSeconds: seconds,
          elapsedSeconds: 0,
          startedAt: null,
          isRunning: false,
          isFinished: false,
        },
      });
    },
    [patchSession]
  );

  const handleLogWorkout = useCallback(() => {
    if (workoutLoggedToday) return;
    onCompleteWorkout();
    const next = advanceAfterWorkoutLogged(calendarState);
    saveTrainingCalendarState(next);
    setCalendarState(next);
    setWorkoutLoggedToday(true);
    clearActiveTrainingSession();
    setSession(null);
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

  if (!session) {
    return (
      <div className="mt-8 sm:mt-10 iron-shell-card p-6 mb-24 text-center text-iron-muted text-sm">
        {t("training.screenTitle")}
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-28 space-y-4">
      <Stagger className="space-y-4">
      <div className="text-center">
        <p className="iron-label text-iron-accent">{t("training.screenTitle")}</p>
        <h2 className="iron-heading text-2xl sm:text-3xl mt-1">{todayTitle}</h2>
        <p className="mt-2 text-sm text-iron-muted">
          {t("training.planSlot", { current: activeSlot, total: 7 })}
          {" · "}
          {activeStage === "warmup"
            ? t("training.flow.stageWarmup")
            : t("training.flow.stageWorkout")}
        </p>
      </div>

      <TrainingTimer session={session} onSessionChange={patchSession} />

      <section className="border border-iron-accent-dim/40 bg-iron-panel p-4 rounded-sm space-y-4 min-h-[200px]">
        {activeStage === "warmup" && (
          <>
            {allWarmupDone && (
              <CompletionMoment message={t("completion.warmup")} />
            )}
            <TrainingStageBlock
              stage="warmup"
              title={t("training.block.warmupTitle")}
              description={t("training.block.warmupDescription")}
              items={warmupItems}
              completedIds={completedWarmup}
              lang={lang}
              onToggleComplete={toggleWarmup}
              onOpenExercise={setDetailExerciseId}
              onOpenRest={handleOpenRest}
              t={t}
            />
            {allWarmupDone ? (
              <div className="space-y-3 pt-2 border-t border-iron-border">
                <p className="text-sm text-iron-muted leading-relaxed">
                  {t("training.flow.warmupCompleteHint")}
                </p>
                <button
                  type="button"
                  onClick={handleGoToWorkout}
                  className="iron-interactive iron-btn-primary w-full py-4 text-base font-semibold min-h-[52px] rounded-sm"
                >
                  {t("training.flow.goToWorkout")}
                </button>
              </div>
            ) : (
              warmupItems.length > 0 && (
                <p className="text-xs text-iron-muted">
                  {t("training.flow.remaining", {
                    count: warmupItems.length - warmupDoneCount,
                  })}
                </p>
              )
            )}
          </>
        )}

        {activeStage === "workout" && (
          <>
            {allWorkoutDone && (
              <CompletionMoment message={t("completion.workout")} />
            )}
            <TrainingStageBlock
              stage="workout"
              title={t("training.block.workoutTitle")}
              description={t("training.block.workoutDescription")}
              items={workoutItems}
              completedIds={completedWorkout}
              lang={lang}
              onToggleComplete={toggleWorkout}
              onOpenExercise={setDetailExerciseId}
              onOpenRest={handleOpenRest}
              t={t}
            />

            <div className="border border-iron-border/80 rounded-sm p-3 bg-iron-panel/80">
              <p className="text-sm font-semibold text-iron-text">
                {t("training.afterWorkout.title")}
              </p>
              <p className="text-xs text-iron-muted mt-1 leading-relaxed">
                {t("training.afterWorkout.body")}
              </p>
            </div>

            {!workoutLoggedToday && (
              <div className="space-y-3 pt-2 border-t border-iron-border">
                {allWorkoutDone ? (
                  <p className="text-sm text-iron-muted leading-relaxed">
                    {t("training.flow.workoutCompleteHint")}
                  </p>
                ) : (
                  <p className="text-sm text-iron-muted">
                    {t("training.flow.remaining", { count: workoutRemaining })}
                  </p>
                )}

                {allWorkoutDone && (
                  <button
                    type="button"
                    onClick={handleLogWorkout}
                    className="iron-interactive iron-btn-primary w-full py-4 text-base font-semibold min-h-[52px] rounded-sm"
                  >
                    {t("training.logWorkout")}
                  </button>
                )}

                {!allWorkoutDone && (
                  <button
                    type="button"
                    onClick={handleLogWorkout}
                    className="iron-interactive w-full py-3 text-sm font-semibold border border-iron-border rounded-sm text-iron-muted"
                  >
                    {t("training.flow.finishAnyway")}
                  </button>
                )}
              </div>
            )}

            {workoutLoggedToday && (
              <p className="text-center text-sm font-semibold text-iron-accent py-3 border border-iron-border rounded-sm bg-iron-raised">
                {t("training.logWorkoutDone")}
              </p>
            )}
          </>
        )}
      </section>
      </Stagger>

      <ExerciseDetailModal
        exercise={detailExercise}
        isOpen={detailExercise !== null}
        onClose={() => setDetailExerciseId(null)}
      />

      <RestTimerPanel
        state={session.restTimerState}
        onStateChange={(restTimerState) => patchSession({ restTimerState })}
      />

      {assessmentInput && assessmentResult && (
        <details className="border border-iron-border rounded-sm p-3 text-sm">
          <summary className="cursor-pointer text-iron-muted font-medium">
            {t("training.coachingExpand")}
          </summary>
          <div className="mt-3 space-y-3">
            <TrainingReasoningBlock
              input={assessmentInput}
              result={assessmentResult}
              dayType={todayDayType}
            />
            <NextMilestoneBlock
              input={assessmentInput}
              pathMode={pathMode}
              emphasis={pathMode === "sport" ? "physical" : "balanced"}
            />
          </div>
        </details>
      )}

      {showReassessmentPrompt && onRetakeAssessment && onDismissReassessment && (
        <ReassessmentPromptBlock
          onRetake={onRetakeAssessment}
          onDismiss={onDismissReassessment}
        />
      )}

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
