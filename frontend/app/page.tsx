"use client";

import OnboardingScreen from "./components/OnboardingScreen";
import { useState, useEffect, useCallback, useMemo } from "react";
import { user } from "./data/user";
import { useProfile } from "./hooks/useProfile";
import { generateProgram } from "./data/programGenerator";
import { usePlayer } from "./hooks/usePlayer";
import { getRank } from "./data/ranks";
import BottomNav from "./components/BottomNav";
import TodayScreen from "./components/TodayScreen";
import TrainingScreen from "./components/TrainingScreen";
import NutritionScreen from "./components/NutritionScreen";
import ProgressScreen from "./components/ProgressScreen";
import AchievementsScreen from "./components/AchievementsScreen";
import MoreScreen from "./components/MoreScreen";
import SettingsScreen from "./components/SettingsScreen";
import ProfileScreen from "./components/ProfileScreen";
import StatsScreen from "./components/StatsScreen";
import StrengthTrackerScreen from "./components/StrengthTrackerScreen";
import { getWorkoutXp } from "./data/xpRewards";
import { useDailyMissions } from "./hooks/useDailyMissions";
import { useBossTrials } from "./hooks/useBossTrials";
import { getBossTrialByWeek } from "./data/bossTrials";
import { useSeasons } from "./hooks/useSeasons";
import { useDailyRewards } from "./hooks/useDailyRewards";
import { useStats } from "./hooks/useStats";
import LegacyScreen from "./components/LegacyScreen";
import HeroScreen from "./components/HeroScreen";
import AppPopups from "./components/AppPopups";
import SplashScreen from "./components/SplashScreen";
import ScreenTransition from "./components/ScreenTransition";
import XpFloatAnimation from "./components/XpFloatAnimation";
import DailyRewardPopup from "./components/DailyRewardPopup";
import { ACHIEVEMENTS } from "./data/achievements";
import { clearAllGameData } from "./utils/storageKeys";
import {
  hapticWorkout,
  hapticMission,
  hapticLevelUp,
  hapticAchievement,
} from "./utils/haptics";

const MORE_SUB_SCREENS = [
  "progress",
  "achievements",
  "strength",
  "legacy",
  "settings",
  "profile",
  "stats",
];

function getNavActiveScreen(screen: string) {
  return MORE_SUB_SCREENS.includes(screen) ? "more" : screen;
}

export default function Home() {
  const { profile, saveProfile, clearProfile } = useProfile();
  const [screen, setScreen] = useState("hero");
  const [showPopup, setShowPopup] = useState(false);
  const [lastXpReward, setLastXpReward] = useState(0);
  const [showWeekPopup, setShowWeekPopup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [xpFloat, setXpFloat] = useState<number | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);
  const clearXpFloat = useCallback(() => setXpFloat(null), []);

  const {
    xp,
    level,
    week,
    body,
    mind,
    work,
    totalXp,
    workoutCount,
    highestLevel,
    addXp,
    addBody,
    addMind,
    addWork,
    nextWeek,
    leveledUp,
    clearLevelUp,
    resetPlayer,
    recordWorkout,
    pendingAchievement,
    clearPendingAchievement,
    achievementsUnlocked,
    unlockAchievement,
    checkAchievements,
  } = usePlayer();

  const {
    missions,
    completeMission,
    completedCount,
    totalCount,
    progress,
  } = useDailyMissions();

  const {
    pendingTrial,
    completeTrial,
    clearPendingTrial,
    checkForNewTrial,
  } = useBossTrials();

  const program = useMemo(
    () => generateProgram(profile, Number(week)),
    [profile, week]
  );

  const {
    completedSeasons,
    pendingSeasonComplete,
    checkForSeasonComplete,
    completeSeason,
    clearPending,
  } = useSeasons();

  const { canClaim, rewardDay, xpReward, claimReward } = useDailyRewards();

  const { stats, daysSinceStart, recordMissionComplete, recordDailyClaim } =
    useStats(level, Boolean(profile));

  const achievementProgressInput = useMemo(
    () => ({
      level,
      week: Number(week),
      totalXp,
      workoutCount,
      loginStreak: stats.currentLoginStreak,
      seasonsCompleted: completedSeasons.length,
    }),
    [
      level,
      week,
      totalXp,
      workoutCount,
      stats.currentLoginStreak,
      completedSeasons.length,
    ]
  );

  useEffect(() => {
    checkForNewTrial(Number(week));
    checkForSeasonComplete(Number(week));
  }, [week, checkForNewTrial]);

  useEffect(() => {
    checkAchievements(stats.currentLoginStreak, completedSeasons.length);
  }, [
    level,
    week,
    totalXp,
    workoutCount,
    stats.currentLoginStreak,
    completedSeasons.length,
    checkAchievements,
  ]);

  useEffect(() => {
    if (canClaim && profile && !showSplash) {
      setShowDailyReward(true);
    }
  }, [canClaim, profile, showSplash]);

  useEffect(() => {
    if (leveledUp) hapticLevelUp();
  }, [leveledUp]);

  useEffect(() => {
    if (pendingAchievement) hapticAchievement();
  }, [pendingAchievement]);

  const handleCompleteBossTrial = useCallback(() => {
    if (pendingTrial) {
      const trial = getBossTrialByWeek(Number(week));

      if (trial) {
        addXp(trial.xpReward);
        completeTrial(pendingTrial);
      }
    }
  }, [pendingTrial, week, addXp, completeTrial]);

  const handleClaimSeason = useCallback(() => {
    const already = completedSeasons.some((s) => s.week === 24);
    if (already) return;

    addXp(1000);
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
  ]);

  const completeWorkout = useCallback(() => {
    const reward = getWorkoutXp(program.phase);

    setLastXpReward(reward);
    addXp(reward);
    addBody(1);
    addMind(1);
    recordWorkout();
    completeMission("workout");
    recordMissionComplete();
    setShowPopup(true);
    hapticWorkout();
  }, [program.phase, addXp, addBody, addMind, recordWorkout, completeMission, recordMissionComplete]);

  const completeDeepWork = useCallback(() => {
    addXp(60);
    addWork(1);
    completeMission("deepwork");
    recordMissionComplete();
    setXpFloat(60);
    hapticMission();
  }, [addXp, addWork, completeMission, recordMissionComplete]);

  const completeProtein = useCallback(() => {
    addXp(40);
    addBody(1);
    completeMission("protein");
    recordMissionComplete();
    setXpFloat(40);
    hapticMission();
  }, [addXp, addBody, completeMission, recordMissionComplete]);

  const completeSleep = useCallback(() => {
    addXp(35);
    addMind(1);
    completeMission("sleep");
    recordMissionComplete();
    setXpFloat(35);
    hapticMission();
  }, [addXp, addMind, completeMission, recordMissionComplete]);

  const handleClaimDailyReward = useCallback(() => {
    const reward = claimReward();
    if (reward > 0) {
      addXp(reward);
      recordDailyClaim();
      hapticMission();
    }
    setShowDailyReward(false);
  }, [claimReward, addXp, recordDailyClaim]);

  const handleResetProgress = useCallback(() => {
    resetPlayer();
    clearProfile();
    clearAllGameData();
    window.location.reload();
  }, [resetPlayer, clearProfile]);

  const weekNumber = Number(week);
  const navScreen = getNavActiveScreen(screen);
  const rank = useMemo(() => getRank(level), [level]);
  const loginStreak = stats.currentLoginStreak;

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {xpFloat !== null && (
        <XpFloatAnimation amount={xpFloat} onDone={clearXpFloat} />
      )}

      <main className="min-h-screen bg-gradient-to-b from-[#d8c7a1] to-[#efe3c2] text-black flex flex-col items-center px-4 sm:px-6 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">
          <div className="text-center mt-4 sm:mt-6">
            <h1 className="text-4xl sm:text-5xl font-black tracking-wide">
              IRON PATH
            </h1>

            <p className="text-xs sm:text-sm mt-2 uppercase tracking-[0.2em]">
              Est. 1950
            </p>
          </div>

          {!profile && (
            <OnboardingScreen onFinish={() => window.location.reload()} />
          )}

          <ScreenTransition screen={screen}>
            {profile && screen === "hero" && (
              <HeroScreen
                profile={profile}
                level={level}
                xp={xp}
                body={body}
                mind={mind}
                work={work}
                week={weekNumber}
                program={program}
                missions={missions}
                completedCount={completedCount}
                totalCount={totalCount}
                progress={progress}
                streak={loginStreak}
              />
            )}

            {profile && screen === "today" && (
              <TodayScreen
                program={program}
                onCompleteDeepWork={completeDeepWork}
                onCompleteProtein={completeProtein}
                onCompleteSleep={completeSleep}
              />
            )}

            {screen === "training" && (
              <TrainingScreen
                program={program}
                onCompleteWorkout={completeWorkout}
                onCompleteWeek={() => {
                  nextWeek();
                  setShowWeekPopup(true);
                }}
              />
            )}

            {screen === "nutrition" && <NutritionScreen />}

            {screen === "progress" && (
              <ProgressScreen
                level={level}
                rank={rank}
                week={weekNumber}
                phase={program.phase}
                xp={xp}
                maxXp={user.maxXp}
                weight={profile?.weight ?? "0"}
                goal={profile?.goal ?? "unknown"}
              />
            )}

            {screen === "achievements" && (
              <AchievementsScreen
                achievementsUnlocked={achievementsUnlocked}
                progressInput={achievementProgressInput}
              />
            )}

            {screen === "more" && (
              <MoreScreen
                onSelectProgress={() => setScreen("progress")}
                onSelectAchievements={() => setScreen("achievements")}
                onSelectStrength={() => setScreen("strength")}
                onSelectLegacy={() => setScreen("legacy")}
                onSelectSettings={() => setScreen("settings")}
                onSelectProfile={() => setScreen("profile")}
                onSelectStats={() => setScreen("stats")}
                level={level}
                rank={rank}
                week={weekNumber}
                phase={program.phase}
                streak={loginStreak}
                body={body}
                mind={mind}
                work={work}
              />
            )}

            {screen === "profile" && profile && (
              <ProfileScreen
                profile={profile}
                level={level}
                onSave={saveProfile}
                onClose={() => setScreen("more")}
              />
            )}

            {screen === "stats" && (
              <StatsScreen
                totalXp={totalXp}
                level={level}
                highestLevel={Math.max(highestLevel, stats.highestLevel)}
                workoutCount={workoutCount}
                missionsCompleted={stats.totalMissionsCompleted}
                achievementsUnlocked={achievementsUnlocked.length}
                achievementsTotal={ACHIEVEMENTS.length}
                seasonsCompleted={completedSeasons.length}
                currentStreak={stats.currentLoginStreak}
                longestStreak={stats.longestLoginStreak}
                daysSinceStart={daysSinceStart}
                onClose={() => setScreen("more")}
              />
            )}

            {screen === "strength" && (
              <StrengthTrackerScreen onClose={() => setScreen("more")} />
            )}

            {screen === "legacy" && (
              <LegacyScreen seasons={completedSeasons} />
            )}

            {screen === "settings" && (
              <SettingsScreen
                onClose={() => setScreen("more")}
                onReset={handleResetProgress}
              />
            )}
          </ScreenTransition>

          <AppPopups
            placement="inline"
            pendingSeasonComplete={pendingSeasonComplete}
            completedSeasons={completedSeasons}
            onClaimSeason={handleClaimSeason}
            onCloseSeason={clearPending}
          />
        </div>

        <AppPopups
          placement="floating"
          showWeekPopup={showWeekPopup}
          week={weekNumber}
          phase={program.phase}
          onCloseWeekPopup={() => setShowWeekPopup(false)}
          showPopup={showPopup}
          lastXpReward={lastXpReward}
          onCloseWorkoutPopup={() => setShowPopup(false)}
          leveledUp={leveledUp}
          level={level}
          rank={rank}
          onCloseLevelUp={clearLevelUp}
          pendingAchievement={pendingAchievement}
          onCloseAchievement={clearPendingAchievement}
          pendingTrial={pendingTrial}
          onCompleteBossTrial={handleCompleteBossTrial}
          onSkipBossTrial={clearPendingTrial}
        />

        <DailyRewardPopup
          isOpen={showDailyReward && canClaim}
          day={rewardDay}
          xpReward={xpReward}
          onClaim={handleClaimDailyReward}
        />

        <BottomNav screen={navScreen} setScreen={setScreen} />
      </main>
    </>
  );
}
