"use client";

import OnboardingScreen from "./components/OnboardingScreen";
import DevPanel from "./components/DevPanel";
import { useState, useEffect, useCallback } from "react";
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
import StrengthTrackerScreen from "./components/StrengthTrackerScreen";
import { getWorkoutXp } from "./data/xpRewards";
import { useDailyMissions } from "./hooks/useDailyMissions";
import { useBossTrials } from "./hooks/useBossTrials";
import { getBossTrialByWeek } from "./data/bossTrials";
import { useSeasons } from "./hooks/useSeasons";
import LegacyScreen from "./components/LegacyScreen";
import HeroScreen from "./components/HeroScreen";
import AppPopups from "./components/AppPopups";
import SplashScreen from "./components/SplashScreen";
import ScreenTransition from "./components/ScreenTransition";
import XpFloatAnimation from "./components/XpFloatAnimation";
import {
  hapticWorkout,
  hapticMission,
  hapticLevelUp,
  hapticAchievement,
} from "./utils/haptics";

const MORE_SUB_SCREENS = ["progress", "achievements", "strength", "legacy"];

function getNavActiveScreen(screen: string) {
  return MORE_SUB_SCREENS.includes(screen) ? "more" : screen;
}

export default function Home() {
  const { profile } = useProfile();
  const [screen, setScreen] = useState("hero");
  const [showPopup, setShowPopup] = useState(false);
  const [lastXpReward, setLastXpReward] = useState(0);
  const [showWeekPopup, setShowWeekPopup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [xpFloat, setXpFloat] = useState<number | null>(null);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);
  const clearXpFloat = useCallback(() => setXpFloat(null), []);

  const {
    xp,
    level,
    week,
    body,
    mind,
    work,
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

  const program = generateProgram(profile, Number(week));

  const {
    completedSeasons,
    pendingSeasonComplete,
    checkForSeasonComplete,
    completeSeason,
    clearPending,
  } = useSeasons();

  useEffect(() => {
    checkForNewTrial(Number(week));
    checkForSeasonComplete(Number(week));
  }, [week, checkForNewTrial]);

  useEffect(() => {
    if (leveledUp) hapticLevelUp();
  }, [leveledUp]);

  useEffect(() => {
    if (pendingAchievement) hapticAchievement();
  }, [pendingAchievement]);

  const handleCompleteBossTrial = () => {
    if (pendingTrial) {
      const trial = getBossTrialByWeek(Number(week));

      if (trial) {
        addXp(trial.xpReward);
        completeTrial(pendingTrial);
      }
    }
  };

  const handleClaimSeason = () => {
    const already = completedSeasons.some((s) => s.week === 24);
    if (already) return;

    addXp(1000);
    addBody(5);
    addMind(5);
    addWork(5);
    if (typeof unlockAchievement === "function") {
      try {
        unlockAchievement("iron_legend");
      } catch (e) {
        // ignore if achievement id not present
      }
    }

    completeSeason(xp, level);
  };

  const completeWorkout = () => {
    const reward = getWorkoutXp(program.phase);

    setLastXpReward(reward);
    addXp(reward);
    addBody(1);
    addMind(1);
    recordWorkout();
    completeMission("workout");
    setShowPopup(true);
    hapticWorkout();
  };

  const completeDeepWork = () => {
    addXp(60);
    addWork(1);
    completeMission("deepwork");
    setXpFloat(60);
    hapticMission();
  };

  const completeProtein = () => {
    addXp(40);
    addBody(1);
    completeMission("protein");
    setXpFloat(40);
    hapticMission();
  };

  const completeSleep = () => {
    addXp(35);
    addMind(1);
    completeMission("sleep");
    setXpFloat(35);
    hapticMission();
  };

  const weekNumber = Number(week);
  const navScreen = getNavActiveScreen(screen);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {xpFloat !== null && (
        <XpFloatAnimation amount={xpFloat} onDone={clearXpFloat} />
      )}

      <main className="min-h-screen bg-gradient-to-b from-[#d8c7a1] to-[#efe3c2] text-black flex flex-col items-center p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">
          <div className="text-center mt-6">
            <h1 className="text-5xl font-black tracking-wide">IRON PATH</h1>

            <p className="text-sm mt-2 uppercase tracking-[0.2em]">Est. 1950</p>
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
                rank={getRank(level)}
                week={weekNumber}
                phase={program.phase}
                xp={xp}
                maxXp={user.maxXp}
                weight={profile?.weight ?? "0"}
                goal={profile?.goal ?? "unknown"}
              />
            )}

            {screen === "achievements" && (
              <AchievementsScreen achievementsUnlocked={achievementsUnlocked} />
            )}

            {screen === "more" && (
              <MoreScreen
                onSelectProgress={() => setScreen("progress")}
                onSelectAchievements={() => setScreen("achievements")}
                onSelectStrength={() => setScreen("strength")}
                onSelectLegacy={() => setScreen("legacy")}
              />
            )}

            {screen === "strength" && (
              <StrengthTrackerScreen onClose={() => setScreen("more")} />
            )}

            {screen === "legacy" && (
              <LegacyScreen seasons={completedSeasons} />
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
          rank={getRank(level)}
          onCloseLevelUp={clearLevelUp}
          pendingAchievement={pendingAchievement}
          onCloseAchievement={clearPendingAchievement}
          pendingTrial={pendingTrial}
          onCompleteBossTrial={handleCompleteBossTrial}
          onSkipBossTrial={clearPendingTrial}
        />

        <DevPanel onReset={resetPlayer} />

        <BottomNav screen={navScreen} setScreen={setScreen} />
      </main>
    </>
  );
}
