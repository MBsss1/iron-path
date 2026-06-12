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
  translateGoal,
  translatePhase,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
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
  onOpenToday: () => void;
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
  onOpenToday,
  onViewBoss,
  assessmentInput = null,
  showReassessmentPrompt = false,
  showAdaptationHint = false,
  onRetakeAssessment,
  onDismissReassessment,
}: Props) {
  const { t } = useTranslation();
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

  const workoutXp = useMemo(
    () => sideMissionXp("workout", profile.classId, level, program.phase),
    [profile.classId, level, program.phase]
  );

  const mainCta = workoutMissionCompleted
    ? { label: t("hero.ctaOpenDay"), action: onOpenToday }
    : { label: t("hero.ctaStartWorkout"), action: onStartTraining };

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
          actionLabel={mainCta.label}
          onAction={mainCta.action}
          questStart
        />

        {assessmentInput && (
          <NextMilestoneBlock
            input={assessmentInput}
            pathMode={pathMode}
            emphasis={pathMode === "sport" ? "physical" : "balanced"}
          />
        )}
      </div>
    );
  }

  const sideMissions = missions.filter((mission) => mission.id !== "workout");

  return (
    <Stagger className="mt-3 sm:mt-5 iron-shell-card p-3.5 mb-5 space-y-2.5">
      {profileCard}

      {showStreakWarning && (
        <StreakWarningCard
          onAction={mainCta.action}
          actionLabel={mainCta.label}
        />
      )}

      <section className="space-y-3">
        <div className="flex justify-between items-baseline gap-2 px-0.5">
          <h3 className="iron-heading text-sm">{t("hero.todayTitle")}</h3>
          <span className="text-xs text-iron-muted">
            {completedCount} / {totalCount}
          </span>
        </div>

        <div className="w-full h-2 iron-progress-track overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={progress} />
        </div>

        <QuestCard
          variant="main"
          icon={MISSION_ICONS.workout}
          title={t("mission.workout")}
          subtitle={t("hero.streakWeek", { streak, week })}
          reward={
            <RewardChip
              amount={workoutXp}
              variant={workoutMissionCompleted ? "muted" : "gold"}
            />
          }
          status={workoutMissionCompleted ? "neutral" : "available"}
          meta={
            workoutMissionCompleted ? (
              <span className="text-iron-accent font-semibold">
                {t("today.statusDone")}
              </span>
            ) : undefined
          }
          progress={progress}
          actionLabel={mainCta.label}
          onAction={mainCta.action}
          questStart
        />

        <div className="space-y-2">
          {sideMissions.map((mission) => (
            <QuestCard
              key={mission.id}
              icon={MISSION_ICONS[mission.id]}
              title={t(`mission.${mission.id}`)}
              reward={
                <RewardChip
                  amount={sideMissionXp(
                    mission.id,
                    profile.classId,
                    level,
                    program.phase
                  )}
                  variant={mission.completed ? "muted" : "gold"}
                />
              }
              status={mission.completed ? "completed" : "available"}
            />
          ))}
        </div>
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
