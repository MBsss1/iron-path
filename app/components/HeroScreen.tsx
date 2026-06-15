"use client";

import { useMemo } from "react";
import { getPathModeFromProfile } from "../data/pathMode";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import { applyClassXpBonus } from "../utils/classBonuses";
import type { AssessmentInput } from "../data/fitnessAssessment";
import type { BossDefinition } from "../data/bosses";
import type { Profile } from "../hooks/useProfile";
import NextMilestoneBlock from "./coaching/NextMilestoneBlock";
import ReassessmentPromptBlock from "./coaching/ReassessmentPromptBlock";
import type { DailyMission } from "../hooks/useDailyMissions";
import type { BossProgressContext } from "../utils/bossProgress";
import {
  translateBossField,
  translateBossProgressLabel,
  translateBossRequirement,
  translateBossRewardTitleById,
  translateDayType,
  translateGoal,
  translatePhase,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import {
  buildWeekPlanForProfile,
  getTodayWorkout,
  loadTrainingCalendarState,
} from "../utils/trainingCalendar";
import TodayPersonalTasksBlock from "./today/TodayPersonalTasksBlock";
import TodayHabitControlBlock from "./today/TodayHabitControlBlock";
import Stagger from "../animations/Stagger";
import AnimatedProgressFill from "../animations/AnimatedProgressFill";
import PlayerProfileCard from "./rpg/PlayerProfileCard";
import StreakWarningCard from "./rpg/StreakWarningCard";
import QuestCard from "./rpg/QuestCard";
import RewardChip from "./rpg/RewardChip";

type Props = {
  profile: Profile;
  level: number;
  xp: number;
  maxXp: number;
  body: number;
  mind: number;
  work: number;
  week: number;
  program: { phase: string };
  missions: DailyMission[];
  completedCount: number;
  totalCount: number;
  progress: number;
  streak: number;
  workoutCount: number;
  workoutMissionCompleted: boolean;
  equippedTitle?: string | null;
  currentBoss: BossDefinition | null;
  bossProgressPercent: number;
  bossProgressContext: BossProgressContext;
  allBossesDefeated: boolean;
  assessmentComplete: boolean;
  onStartAssessment: () => void;
  onStartTraining: () => void;
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
  onViewBoss: () => void;
  assessmentInput?: AssessmentInput | null;
  showReassessmentPrompt?: boolean;
  showAdaptationHint?: boolean;
  onRetakeAssessment?: () => void;
  onDismissReassessment?: () => void;
};

const MISSION_ICONS: Record<DailyMission["id"], string> = {
  workout: "💪",
  deepwork: "🎯",
  protein: "🥩",
  sleep: "😴",
};

function sideMissionXp(
  id: DailyMission["id"],
  classId: Profile["classId"],
  level: number,
  phase: string
): number {
  if (id === "workout") {
    return applyClassXpBonus(getWorkoutXp(phase), classId, "workout", level);
  }
  const base =
    id === "deepwork"
      ? MISSION_XP.deepWork
      : id === "protein"
        ? MISSION_XP.protein
        : MISSION_XP.sleep;
  const bonusType = id === "deepwork" ? "deepWork" : "mission";
  return applyClassXpBonus(base, classId, bonusType, level);
}

export default function HeroScreen({
  profile,
  level,
  xp,
  maxXp,
  body,
  mind,
  work,
  week,
  program,
  missions,
  completedCount,
  totalCount,
  progress,
  streak,
  workoutCount,
  workoutMissionCompleted,
  equippedTitle,
  currentBoss,
  bossProgressPercent,
  bossProgressContext,
  allBossesDefeated,
  assessmentComplete,
  onStartAssessment,
  onStartTraining,
  onCompleteDeepWork,
  onCompleteProtein,
  onCompleteSleep,
  onViewBoss,
  assessmentInput = null,
  showReassessmentPrompt = false,
  showAdaptationHint = false,
  onRetakeAssessment,
  onDismissReassessment,
}: Props) {
  const { t, locale } = useTranslation();
  const lang = locale === "ru" ? "ru" : "en";
  const pathMode = getPathModeFromProfile(profile);
  const pathModeLabel = pathMode ? t(`pathMode.${pathMode}.title`) : "";
  const titleLabel = translateBossRewardTitleById(equippedTitle, t);
  const bossRequirementMet = bossProgressPercent >= 100;
  const isNewUser = workoutCount === 0;
  const showBossBlock = workoutCount > 0;
  const phaseLabel = translatePhase(program.phase, t);
  const bossProgressLabel = currentBoss
    ? translateBossProgressLabel(currentBoss, bossProgressContext, t)
    : "";

  const isCompleted = (id: DailyMission["id"]) =>
    missions.find((mission) => mission.id === id)?.completed ?? false;

  const tryComplete = (id: DailyMission["id"], action: () => void) => {
    if (isCompleted(id)) return;
    action();
  };

  const deepWorkDone = isCompleted("deepwork");
  const proteinDone = isCompleted("protein");
  const sleepDone = isCompleted("sleep");
  const workoutDone = isCompleted("workout");

  const calendarState = useMemo(
    () => loadTrainingCalendarState(week),
    [week]
  );

  const weekPlan = useMemo(
    () => buildWeekPlanForProfile(profile),
    [profile]
  );

  const todayWorkout = useMemo(
    () => getTodayWorkout(profile, weekPlan, calendarState.activeDayIndex),
    [profile, weekPlan, calendarState.activeDayIndex]
  );

  const todayDayType = weekPlan.days[calendarState.activeDayIndex]?.dayType;
  const dayTypeLabel = todayDayType
    ? translateDayType(todayDayType, t)
    : todayWorkout.title[lang];

  const workoutXp = useMemo(
    () => sideMissionXp("workout", profile.classId, level, program.phase),
    [profile.classId, level, program.phase]
  );

  const deepWorkXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.deepWork, profile.classId, "deepWork", level),
    [profile.classId, level]
  );
  const proteinXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.protein, profile.classId, "mission", level),
    [profile.classId, level]
  );
  const sleepXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.sleep, profile.classId, "mission", level),
    [profile.classId, level]
  );

  const showStreakWarning = assessmentComplete && !workoutMissionCompleted;

  const profileCard = (
    <PlayerProfileCard
      profile={profile}
      level={level}
      xp={xp}
      maxXp={maxXp}
      streak={streak}
      titleLabel={titleLabel}
      pathModeLabel={pathModeLabel || undefined}
    />
  );

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

  const todayDaySection = assessmentComplete ? (
    <>
      <div className="text-center text-sm text-iron-muted">
        <p className="font-semibold text-iron-accent">{phaseLabel}</p>
        <p>{t("today.week", { week })}</p>
      </div>

      <QuestCard
        variant="main"
        icon={MISSION_ICONS.workout}
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
        onAction={workoutDone ? undefined : onStartTraining}
        questStart={!workoutDone}
      />

      <p className="iron-label text-center">{t("today.habitsTitle")}</p>

      <div className="space-y-2">
        <QuestCard
          icon={MISSION_ICONS.deepwork}
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
          icon={MISSION_ICONS.protein}
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
          icon={MISSION_ICONS.sleep}
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
        <div className="space-y-4">
          <TodayPersonalTasksBlock />
          <TodayHabitControlBlock />
        </div>
      )}

      {pathMode === "balance" && <TodayPersonalTasksBlock compact />}
    </>
  ) : (
    <QuestCard
      variant="main"
      icon="🗺️"
      title={t("hero.pathNotFormedTitle")}
      subtitle={t("today.assessmentRequired")}
      actionLabel={t("hero.startAssessment")}
      onAction={onStartAssessment}
    />
  );

  if (!assessmentComplete) {
    return (
      <div className="mt-3 sm:mt-5 iron-shell-card p-3.5 mb-5 space-y-2.5">
        {profileCard}

        <QuestCard
          className="mt-0.5"
          variant="main"
          icon="🗺️"
          title={t("hero.pathNotFormedTitle")}
          subtitle={t("hero.pathNotFormedBody")}
          actionLabel={t("hero.startAssessment")}
          onAction={onStartAssessment}
        />
      </div>
    );
  }

  if (isNewUser) {
    return (
      <div className="mt-3 sm:mt-5 iron-shell-card p-3.5 mb-5 space-y-2.5">
        {profileCard}

        <QuestCard
          variant="main"
          icon="⚔️"
          title={t("hero.firstStepTitle")}
          subtitle={t("hero.firstStepBodyTraining")}
          meta={
            <p className="text-sm font-semibold text-iron-accent">
              {t("hero.firstStepStepLabel")}
            </p>
          }
          reward={<RewardChip amount={workoutXp} />}
          actionLabel={t("hero.ctaStartWorkout")}
          onAction={onStartTraining}
          questStart
        />

        {assessmentInput && (
          <NextMilestoneBlock
            input={assessmentInput}
            pathMode={pathMode}
            emphasis={pathMode === "sport" ? "physical" : "balanced"}
          />
        )}

        <section className="space-y-3 pt-1">{todayDaySection}</section>
      </div>
    );
  }

  return (
    <Stagger className="mt-3 sm:mt-5 iron-shell-card p-3.5 mb-5 space-y-2.5">
      {profileCard}

      {showStreakWarning && (
        <StreakWarningCard
          onAction={onStartTraining}
          actionLabel={t("hero.ctaStartWorkout")}
        />
      )}

      <section className="space-y-3">
        <div className="flex justify-between items-baseline gap-2 px-0.5">
          <h3 className="iron-heading text-sm">{t("today.title")}</h3>
          <span className="text-xs text-iron-muted">
            {completedCount} / {totalCount}
          </span>
        </div>

        <div className="w-full h-2 iron-progress-track overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={progress} />
        </div>

        {todayDaySection}
      </section>

      {assessmentInput && (
        <NextMilestoneBlock
          input={assessmentInput}
          pathMode={pathMode}
          emphasis={
            pathMode === "sport"
              ? "physical"
              : pathMode === "self_development"
                ? "habits"
                : "balanced"
          }
        />
      )}

      {(showReassessmentPrompt || showAdaptationHint) &&
        onRetakeAssessment &&
        onDismissReassessment && (
        <ReassessmentPromptBlock
          variant={showAdaptationHint && !showReassessmentPrompt ? "adaptation" : "default"}
          onRetake={onRetakeAssessment}
          onDismiss={onDismissReassessment}
        />
      )}

      {showBossBlock && (
        <section className="iron-dossier p-3">
          <p className="iron-label text-iron-danger">{t("hero.trialLabel")}</p>

          {allBossesDefeated ? (
            <p className="text-sm text-iron-muted mt-2">{t("hero.allTrialsCleared")}</p>
          ) : currentBoss ? (
            <>
              <h3 className="iron-heading text-lg mt-1">
                {translateBossField(currentBoss, "name", t)}
              </h3>
              <p className="text-xs text-iron-muted mt-1 leading-relaxed">
                {translateBossField(currentBoss, "description", t)}
              </p>
              <div className="mt-3 border-t border-iron-border pt-2">
                <p className="iron-label mb-1.5">{t("hero.requirements")}</p>
                <p className="text-sm flex items-start gap-2">
                  <span className="text-iron-danger shrink-0">
                    {bossRequirementMet ? "✓" : "□"}
                  </span>
                  <span>{translateBossRequirement(currentBoss, t)}</span>
                </p>
                <p className="text-xs text-iron-muted mt-1 pl-5">{bossProgressLabel}</p>
                <div className="w-full h-1.5 iron-progress-track mt-2 overflow-hidden">
                  <AnimatedProgressFill
                    percent={bossProgressPercent}
                    variant="danger"
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-iron-muted mt-2">{t("hero.noActiveTrial")}</p>
          )}

          <button
            type="button"
            onClick={onViewBoss}
            className="iron-interactive iron-btn-secondary w-full mt-3 py-2 text-xs font-semibold rounded-sm"
          >
            {t("hero.viewTrials")}
          </button>
        </section>
      )}

      <section className="iron-card-panel px-3 py-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <div>
          <p className="iron-label">{t("hero.currentGoal")}</p>
          <p className="text-iron-text mt-0.5">
            {translateGoal(profile.goal, t)} · {phaseLabel}
          </p>
        </div>
        <p className="text-xs text-iron-muted">{t("hero.seasonWeek", { week })}</p>
      </section>
    </Stagger>
  );
}
