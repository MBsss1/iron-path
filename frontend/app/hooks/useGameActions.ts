"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BossId, BossDefinition } from "../data/bosses";
import { BOSSES, getBoss } from "../data/bosses";
import { getBossTrialByWeek } from "../data/bossTrials";
import type { BossTrialId } from "../data/bossTrials";
import type { Profile } from "./useProfile";
import type { DailyMission } from "./useDailyMissions";
import type { AchievementDefinition, AchievementId } from "../data/achievements";
import {
  applyClassXpBonus,
  applyClassLevelUpBonus,
} from "../utils/classBonuses";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import {
  hapticWorkout,
  hapticMission,
  hapticLevelUp,
  hapticAchievement,
  hapticBossDefeat,
} from "../utils/haptics";
import { getBossProgressPercent, getCurrentBoss, type BossProgressContext } from "../utils/bossProgress";
import { isWorkoutLoggedToday } from "../utils/workoutGuards";
import {
  buildWeekPlanForProfile,
  loadTrainingCalendarState,
  resetCalendarForNewWeek,
  saveTrainingCalendarState,
} from "../utils/trainingCalendar";
import { canAdvanceProgramWeek } from "../utils/workoutGuards";
import { clearAllGameData } from "../utils/storageKeys";

type ProgramSlice = {
  phase: string;
  week: number;
};

type PlayerSlice = {
  xp: number;
  level: number;
  week: number | string;
  body: number;
  mind: number;
  work: number;
  totalXp: number;
  workoutCount: number;
  leveledUp: boolean;
  pendingAchievement: AchievementDefinition | null;
  addXp: (amount: number) => void;
  addBody: (amount: number) => void;
  addMind: (amount: number) => void;
  addWork: (amount: number) => void;
  nextWeek: () => void;
  clearLevelUp: () => void;
  clearPendingAchievement: () => void;
  resetPlayer: () => void;
  recordWorkout: () => void;
  unlockAchievement: (id: AchievementId) => void;
  checkAchievements: (loginStreak: number, seasonsCompleted: number) => void;
};

type MissionsSlice = {
  missions: DailyMission[];
  completeMission: (id: DailyMission["id"]) => void;
};

type BossTrialsSlice = {
  pendingTrial: BossTrialId | null;
  completeTrial: (trialId: BossTrialId) => void;
  clearPendingTrial: () => void;
  checkForNewTrial: (week: number) => void;
};

type BossesSlice = {
  defeatedBosses: BossId[];
  buildContext: (stats: {
    level: number;
    workoutCount: number;
    missionsCompleted: number;
    currentStreak: number;
    totalXp: number;
  }) => BossProgressContext;
  defeatBoss: (bossId: BossId) => void;
  clearPendingDefeat: () => void;
  recordDeepWork: () => void;
  isRequirementMet: (boss: BossDefinition, ctx: BossProgressContext) => boolean;
  getPendingDefeatBoss: () => BossDefinition | null;
};

type SeasonsSlice = {
  completedSeasons: { week: number }[];
  checkForSeasonComplete: (week: number) => void;
  completeSeason: (xp: number, level: number) => void;
};

type StatsSlice = {
  stats: {
    currentLoginStreak: number;
    totalMissionsCompleted: number;
  };
  recordMissionComplete: () => void;
  recordDailyClaim: () => void;
};

type DailyRewardsSlice = {
  claimReward: () => number;
};

export type UseGameActionsOptions = {
  classId?: string | null;
  program: ProgramSlice;
  profile: Profile | null;
  player: PlayerSlice;
  missions: MissionsSlice;
  bossTrials: BossTrialsSlice;
  bosses: BossesSlice;
  seasons: SeasonsSlice;
  stats: StatsSlice;
  dailyRewards: DailyRewardsSlice;
  storageReady: boolean;
  canShowDailyReward: boolean;
  showSplash: boolean;
  showIntro: boolean;
  clearProfile: () => void;
};

export function useGameActions({
  classId,
  program,
  profile,
  player,
  missions: missionsSlice,
  bossTrials,
  bosses,
  seasons,
  stats: statsSlice,
  dailyRewards,
  storageReady,
  canShowDailyReward,
  showSplash,
  showIntro,
  clearProfile,
}: UseGameActionsOptions) {
  const {
    xp,
    level,
    week,
    workoutCount,
    totalXp,
    leveledUp,
    pendingAchievement,
    addXp,
    addBody,
    addMind,
    addWork,
    nextWeek,
    clearLevelUp,
    clearPendingAchievement,
    resetPlayer,
    recordWorkout,
    unlockAchievement,
    checkAchievements,
  } = player;

  const { missions, completeMission } = missionsSlice;
  const {
    pendingTrial,
    completeTrial,
    clearPendingTrial,
    checkForNewTrial,
  } = bossTrials;
  const {
    defeatedBosses,
    buildContext,
    defeatBoss,
    clearPendingDefeat,
    recordDeepWork,
    isRequirementMet,
    getPendingDefeatBoss,
  } = bosses;
  const { completedSeasons, checkForSeasonComplete, completeSeason } = seasons;
  const { stats, recordMissionComplete, recordDailyClaim } = statsSlice;
  const { claimReward } = dailyRewards;

  const [showPopup, setShowPopup] = useState(false);
  const [lastXpReward, setLastXpReward] = useState(0);
  const [showWeekPopup, setShowWeekPopup] = useState(false);
  const [xpFloat, setXpFloat] = useState<number | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [bossDefeatXp, setBossDefeatXp] = useState(0);
  const levelUpBonusApplied = useRef(false);

  const weekNumber = Number(week);
  const loginStreak = stats.currentLoginStreak;

  const clearXpFloat = useCallback(() => setXpFloat(null), []);

  const achievementProgressInput = useMemo(
    () => ({
      level,
      week: weekNumber,
      totalXp,
      workoutCount,
      loginStreak: stats.currentLoginStreak,
      seasonsCompleted: completedSeasons.length,
    }),
    [
      level,
      weekNumber,
      totalXp,
      workoutCount,
      stats.currentLoginStreak,
      completedSeasons.length,
    ]
  );

  const bossProgressContext = useMemo(
    () =>
      buildContext({
        level,
        workoutCount,
        missionsCompleted: stats.totalMissionsCompleted,
        currentStreak: loginStreak,
        totalXp,
      }),
    [
      buildContext,
      level,
      workoutCount,
      stats.totalMissionsCompleted,
      loginStreak,
      totalXp,
    ]
  );

  const currentBoss = useMemo(
    () => getCurrentBoss(bossProgressContext),
    [bossProgressContext]
  );

  const bossProgressPercent = currentBoss
    ? getBossProgressPercent(currentBoss, bossProgressContext)
    : 0;

  const allBossesDefeated = defeatedBosses.length >= BOSSES.length;

  const workoutMissionCompleted =
    missions.find((m) => m.id === "workout")?.completed ?? false;

  const pendingBossDefeat = getPendingDefeatBoss();

  const defeatedBadges = useMemo(
    () =>
      defeatedBosses
        .map((id) => getBoss(id)?.rewards.badge)
        .filter((badge): badge is string => Boolean(badge)),
    [defeatedBosses]
  );

  useEffect(() => {
    if (!storageReady) return;
    checkForNewTrial(weekNumber);
    checkForSeasonComplete(weekNumber);
  }, [weekNumber, checkForNewTrial, checkForSeasonComplete, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    checkAchievements(stats.currentLoginStreak, completedSeasons.length);
  }, [
    level,
    week,
    totalXp,
    workoutCount,
    stats.currentLoginStreak,
    completedSeasons.length,
    checkAchievements,
    storageReady,
  ]);

  useEffect(() => {
    if (!storageReady) return;

    if (canShowDailyReward && !showSplash && !showIntro) {
      setShowDailyReward(true);
      return;
    }

    if (workoutCount === 0) {
      setShowDailyReward(false);
    }
  }, [
    canShowDailyReward,
    showSplash,
    showIntro,
    workoutCount,
    storageReady,
  ]);

  useEffect(() => {
    if (leveledUp) hapticLevelUp();
  }, [leveledUp]);

  useEffect(() => {
    if (pendingAchievement) hapticAchievement();
  }, [pendingAchievement]);

  useEffect(() => {
    if (leveledUp && classId && !levelUpBonusApplied.current) {
      applyClassLevelUpBonus(classId, addBody, addMind, addWork);
      levelUpBonusApplied.current = true;
    }
    if (!leveledUp) {
      levelUpBonusApplied.current = false;
    }
  }, [leveledUp, classId, addBody, addMind, addWork]);

  const isMissionCompleted = useCallback(
    (id: DailyMission["id"]) =>
      missions.find((mission) => mission.id === id)?.completed ?? false,
    [missions]
  );

  const handleCompleteBossTrial = useCallback(() => {
    if (pendingTrial) {
      const trial = getBossTrialByWeek(weekNumber);

      if (trial) {
        addXp(applyClassXpBonus(trial.xpReward, classId, "all", level));
        completeTrial(pendingTrial);
      }
    }
  }, [pendingTrial, weekNumber, addXp, completeTrial, classId, level]);

  const handleClaimSeason = useCallback(() => {
    const already = completedSeasons.some((s) => s.week === 24);
    if (already) return;

    addXp(applyClassXpBonus(1000, classId, "all", level));
    addBody(5);
    addMind(5);
    addWork(5);
    try {
      unlockAchievement("iron_legend");
      unlockAchievement("first_season");
    } catch {
      // ignore if achievement id not present
    }

    completeSeason(xp, level);
  }, [
    completedSeasons,
    addXp,
    addBody,
    addMind,
    addWork,
    unlockAchievement,
    completeSeason,
    xp,
    level,
    classId,
  ]);

  const completeWorkout = useCallback(() => {
    if (isMissionCompleted("workout") || isWorkoutLoggedToday()) return;

    const reward = applyClassXpBonus(
      getWorkoutXp(program.phase),
      classId,
      "workout",
      level
    );

    setLastXpReward(reward);
    addXp(reward);
    addBody(1);
    addMind(1);
    recordWorkout();
    completeMission("workout");
    recordMissionComplete();
    setShowPopup(true);
    hapticWorkout();
  }, [
    isMissionCompleted,
    program.phase,
    classId,
    level,
    addXp,
    addBody,
    addMind,
    recordWorkout,
    completeMission,
    recordMissionComplete,
  ]);

  const completeDeepWork = useCallback(() => {
    if (isMissionCompleted("deepwork")) return;

    const reward = applyClassXpBonus(MISSION_XP.deepWork, classId, "deepWork", level);
    addXp(reward);
    addWork(1);
    recordDeepWork();
    completeMission("deepwork");
    recordMissionComplete();
    setXpFloat(reward);
    hapticMission();
  }, [
    isMissionCompleted,
    classId,
    level,
    addXp,
    addWork,
    recordDeepWork,
    completeMission,
    recordMissionComplete,
  ]);

  const completeProtein = useCallback(() => {
    if (isMissionCompleted("protein")) return;

    const reward = applyClassXpBonus(MISSION_XP.protein, classId, "mission", level);
    addXp(reward);
    addBody(1);
    completeMission("protein");
    recordMissionComplete();
    setXpFloat(reward);
    hapticMission();
  }, [
    isMissionCompleted,
    classId,
    level,
    addXp,
    addBody,
    completeMission,
    recordMissionComplete,
  ]);

  const completeSleep = useCallback(() => {
    if (isMissionCompleted("sleep")) return;

    const reward = applyClassXpBonus(MISSION_XP.sleep, classId, "mission", level);
    addXp(reward);
    addMind(1);
    completeMission("sleep");
    recordMissionComplete();
    setXpFloat(reward);
    hapticMission();
  }, [
    isMissionCompleted,
    classId,
    level,
    addXp,
    addMind,
    completeMission,
    recordMissionComplete,
  ]);

  const handleClaimDailyReward = useCallback(() => {
    const reward = claimReward();
    if (reward > 0) {
      addXp(applyClassXpBonus(reward, classId, "all", level));
      recordDailyClaim();
      hapticMission();
    }
    setShowDailyReward(false);
  }, [claimReward, addXp, classId, level, recordDailyClaim]);

  const handleCompleteWeek = useCallback(() => {
    if (!profile) return;
    const calendarState = loadTrainingCalendarState(program.week);
    const weekPlan = buildWeekPlanForProfile(profile);
    if (!canAdvanceProgramWeek(calendarState, weekPlan)) {
      return;
    }
    nextWeek();
    saveTrainingCalendarState(
      resetCalendarForNewWeek(Math.min(program.week + 1, 24))
    );
    setShowWeekPopup(true);
  }, [profile, program.week, nextWeek]);

  const handleClaimBoss = useCallback(
    (bossId: BossId) => {
      const boss = getBoss(bossId);
      if (!boss) return;
      if (defeatedBosses.includes(bossId)) return;
      if (!isRequirementMet(boss, bossProgressContext)) return;

      const xpReward = applyClassXpBonus(
        boss.rewards.xp,
        classId,
        "all",
        level
      );
      setBossDefeatXp(xpReward);
      addXp(xpReward);
      defeatBoss(bossId);
      hapticBossDefeat();
    },
    [
      defeatedBosses,
      isRequirementMet,
      bossProgressContext,
      classId,
      level,
      addXp,
      defeatBoss,
    ]
  );

  const handleCloseBossDefeat = useCallback(() => {
    clearPendingDefeat();
    setBossDefeatXp(0);
  }, [clearPendingDefeat]);

  const handleResetProgress = useCallback(() => {
    resetPlayer();
    clearProfile();
    clearAllGameData();
    window.location.reload();
  }, [resetPlayer, clearProfile]);

  return {
    weekNumber,
    loginStreak,
    achievementProgressInput,
    bossProgressContext,
    currentBoss,
    bossProgressPercent,
    allBossesDefeated,
    workoutMissionCompleted,
    pendingBossDefeat,
    defeatedBadges,
    showPopup,
    setShowPopup,
    lastXpReward,
    showWeekPopup,
    setShowWeekPopup,
    xpFloat,
    clearXpFloat,
    showDailyReward,
    setShowDailyReward,
    bossDefeatXp,
    completeWorkout,
    completeDeepWork,
    completeProtein,
    completeSleep,
    handleCompleteBossTrial,
    handleClaimSeason,
    handleClaimDailyReward,
    handleCompleteWeek,
    handleClaimBoss,
    handleCloseBossDefeat,
    handleResetProgress,
    clearLevelUp,
    clearPendingAchievement,
    clearPendingTrial,
  };
}
