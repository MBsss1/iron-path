"use client";

import OnboardingScreen from "./components/OnboardingScreen";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import ClassSelectionScreen from "./components/ClassSelectionScreen";
import SkillTreeScreen from "./components/SkillTreeScreen";
import StrengthTrackerScreen from "./components/StrengthTrackerScreen";
import BossScreen from "./components/BossScreen";
import type { ClassId } from "./data/classes";
import type { BossId } from "./data/bosses";
import { BOSSES, getBoss } from "./data/bosses";
import {
  applyClassXpBonus,
  applyClassLevelUpBonus,
} from "./utils/classBonuses";
import { getWorkoutXp, MAX_XP_PER_LEVEL, MISSION_XP } from "./data/xpRewards";
import { useDailyMissions, type DailyMission } from "./hooks/useDailyMissions";
import { useBossTrials } from "./hooks/useBossTrials";
import { useBosses } from "./hooks/useBosses";
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
  getBossProgressLabel,
  getBossProgressPercent,
} from "./utils/bossProgress";
import {
  hapticWorkout,
  hapticMission,
  hapticLevelUp,
  hapticAchievement,
  hapticBossDefeat,
} from "./utils/haptics";
import {
  applyTelegramTheme,
  configureTelegramBackButton,
  getTelegramBackButtonTarget,
  subscribeTelegramThemeChange,
  telegramExpand,
  telegramReady,
} from "./utils/telegram";
import LanguageProvider from "./i18n/LanguageProvider";
import { useTranslation } from "./i18n/useTranslation";
import LanguageSelectionScreen from "./components/LanguageSelectionScreen";

const MORE_SUB_SCREENS = [
  "progress",
  "achievements",
  "strength",
  "legacy",
  "settings",
  "profile",
  "stats",
  "skilltree",
  "bosses",
];

function getNavActiveScreen(screen: string) {
  return MORE_SUB_SCREENS.includes(screen) ? "more" : screen;
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}

function HomeContent() {
  const { loaded: languageLoaded, languageChosen, setLocale, t } = useTranslation();
  const { profile, loaded: profileLoaded, saveProfile, clearProfile } = useProfile();
  const classId = profile?.classId;
  const [screen, setScreen] = useState("hero");
  const [showPopup, setShowPopup] = useState(false);
  const [lastXpReward, setLastXpReward] = useState(0);
  const [showWeekPopup, setShowWeekPopup] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [xpFloat, setXpFloat] = useState<number | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [bossDefeatXp, setBossDefeatXp] = useState(0);
  const levelUpBonusApplied = useRef(false);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);
  const clearXpFloat = useCallback(() => setXpFloat(null), []);
  const goBackToMore = useCallback(() => setScreen("more"), []);

  useEffect(() => {
    telegramReady();
    telegramExpand();
    applyTelegramTheme();
    const unsubscribeTheme = subscribeTelegramThemeChange();
    return unsubscribeTheme;
  }, []);

  const handleTelegramBack = useCallback(() => {
    const target = getTelegramBackButtonTarget(screen, MORE_SUB_SCREENS);
    if (target === "more") {
      setScreen("more");
      return;
    }
    if (target === "hero") {
      setScreen("hero");
    }
  }, [screen]);

  const {
    loaded: playerLoaded,
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
    loaded: dailyMissionsLoaded,
    missions,
    completeMission,
    completedCount,
    totalCount,
    progress,
  } = useDailyMissions();

  const {
    loaded: bossTrialsLoaded,
    pendingTrial,
    completeTrial,
    clearPendingTrial,
    checkForNewTrial,
  } = useBossTrials();

  const {
    loaded: bossesLoaded,
    defeatedBosses,
    equippedTitle,
    unlockedTitleIds,
    completionPercent: bossCompletionPercent,
    recordDeepWork,
    buildContext,
    defeatBoss,
    clearPendingDefeat,
    equipTitle,
    getBossStatus,
    getCurrentBoss,
    isRequirementMet,
    getPendingDefeatBoss,
  } = useBosses();

  const program = useMemo(
    () => generateProgram(profile, Number(week)),
    [profile, week]
  );

  const {
    loaded: seasonsLoaded,
    completedSeasons,
    pendingSeasonComplete,
    checkForSeasonComplete,
    completeSeason,
    clearPending,
  } = useSeasons();

  const {
    loaded: dailyRewardsLoaded,
    canClaim,
    rewardDay,
    xpReward,
    claimReward,
  } = useDailyRewards();

  const {
    loaded: statsLoaded,
    stats,
    daysSinceStart,
    recordMissionComplete,
    recordDailyClaim,
  } = useStats(level);

  const storageReady =
    profileLoaded &&
    playerLoaded &&
    dailyRewardsLoaded &&
    dailyMissionsLoaded &&
    statsLoaded &&
    bossesLoaded &&
    bossTrialsLoaded &&
    seasonsLoaded;

  const appReady = storageReady && Boolean(profile?.classId);

  useEffect(() => {
    const visible =
      appReady && getTelegramBackButtonTarget(screen, MORE_SUB_SCREENS) !== null;
    return configureTelegramBackButton({
      visible,
      onClick: handleTelegramBack,
    });
  }, [appReady, screen, handleTelegramBack]);

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
    if (!storageReady) return;
    checkForNewTrial(Number(week));
    checkForSeasonComplete(Number(week));
  }, [week, checkForNewTrial, checkForSeasonComplete, storageReady]);

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
    if (canClaim && profile && !showSplash) {
      setShowDailyReward(true);
    }
  }, [canClaim, profile, showSplash, storageReady]);

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
        addXp(applyClassXpBonus(trial.xpReward, classId, "all", level));
        completeTrial(pendingTrial);
      }
    }
  }, [pendingTrial, week, addXp, completeTrial, classId, level]);

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

  const isMissionCompleted = useCallback(
    (id: DailyMission["id"]) =>
      missions.find((mission) => mission.id === id)?.completed ?? false,
    [missions]
  );

  const completeWorkout = useCallback(() => {
    if (isMissionCompleted("workout")) return;

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
    [getCurrentBoss, bossProgressContext]
  );

  const allBossesDefeated = defeatedBosses.length >= BOSSES.length;

  const bossProgressPercent = currentBoss
    ? getBossProgressPercent(currentBoss, bossProgressContext)
    : 0;

  const bossProgressLabel = currentBoss
    ? getBossProgressLabel(currentBoss, bossProgressContext)
    : "";

  const handleContinueToday = useCallback(() => setScreen("today"), []);
  const handleViewBoss = useCallback(() => setScreen("bosses"), []);

  const pendingBossDefeat = getPendingDefeatBoss();

  const defeatedBadges = useMemo(
    () =>
      defeatedBosses
        .map((id) => getBoss(id)?.rewards.badge)
        .filter((badge): badge is string => Boolean(badge)),
    [defeatedBosses]
  );

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

  const handleConfirmClass = useCallback(
    (selectedClassId: ClassId) => {
      if (!profile) return;
      saveProfile({
        ...profile,
        classId: selectedClassId,
        classChangedAt: null,
      });
    },
    [profile, saveProfile]
  );

  useEffect(() => {
    if (leveledUp && classId && !levelUpBonusApplied.current) {
      applyClassLevelUpBonus(classId, addBody, addMind, addWork);
      levelUpBonusApplied.current = true;
    }
    if (!leveledUp) {
      levelUpBonusApplied.current = false;
    }
  }, [leveledUp, classId, addBody, addMind, addWork]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {!showSplash && languageLoaded && !languageChosen && (
        <LanguageSelectionScreen onSelect={setLocale} />
      )}

      {!showSplash && languageLoaded && languageChosen && !storageReady && (
        <div
          className="fixed inset-0 z-[99] flex items-center justify-center iron-page"
          aria-busy="true"
          aria-label="Loading saved progress"
        >
          <div className="text-center iron-shell-card py-8 px-10">
            <p className="iron-label">{t("app.loading")}</p>
            <div className="mt-4 h-0.5 w-20 mx-auto bg-iron-accent-dim" />
          </div>
        </div>
      )}

      {languageChosen && xpFloat !== null && (
        <XpFloatAnimation amount={xpFloat} onDone={clearXpFloat} />
      )}

      {languageChosen && (
      <main className="min-h-screen iron-page flex flex-col items-center px-4 sm:px-6 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">
          <div className="text-center mt-4 sm:mt-6 iron-page-header">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-iron-text">
              {t("app.title")}
            </h1>

            <p className="text-xs sm:text-sm mt-2 iron-page-header-sub">{t("app.est")}</p>
          </div>

          {profileLoaded && !profile && (
            <OnboardingScreen onFinish={() => window.location.reload()} />
          )}

          {profileLoaded && profile && !profile.classId && (
            <ClassSelectionScreen onConfirm={handleConfirmClass} />
          )}

          <ScreenTransition screen={screen}>
            {storageReady && profile && profile.classId && screen === "hero" && (
              <HeroScreen
                profile={profile}
                level={level}
                xp={xp}
                maxXp={MAX_XP_PER_LEVEL}
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
                equippedTitle={equippedTitle}
                currentBoss={currentBoss}
                bossProgressPercent={bossProgressPercent}
                bossProgressLabel={bossProgressLabel}
                allBossesDefeated={allBossesDefeated}
                onContinueToday={handleContinueToday}
                onViewBoss={handleViewBoss}
              />
            )}

            {storageReady && profile && profile.classId && screen === "today" && (
              <TodayScreen
                program={program}
                classId={classId}
                level={level}
                missions={missions}
                onCompleteDeepWork={completeDeepWork}
                onCompleteProtein={completeProtein}
                onCompleteSleep={completeSleep}
              />
            )}

            {storageReady && profile?.classId && screen === "training" && (
              <TrainingScreen
                program={program}
                classId={classId}
                level={level}
                onCompleteWorkout={completeWorkout}
                onCompleteWeek={() => {
                  nextWeek();
                  setShowWeekPopup(true);
                }}
              />
            )}

            {storageReady && profile?.classId && screen === "nutrition" && (
              <NutritionScreen goal={profile?.goal} />
            )}

            {storageReady && profile?.classId && screen === "progress" && (
              <ProgressScreen
                level={level}
                rank={rank}
                week={weekNumber}
                phase={program.phase}
                xp={xp}
                maxXp={MAX_XP_PER_LEVEL}
                weight={profile?.weight ?? "0"}
                goal={profile?.goal ?? "unknown"}
                avatarId={profile.avatarId}
                onBack={goBackToMore}
              />
            )}

            {storageReady && profile?.classId && screen === "achievements" && (
              <AchievementsScreen
                achievementsUnlocked={achievementsUnlocked}
                progressInput={achievementProgressInput}
                onBack={goBackToMore}
              />
            )}

            {storageReady && profile?.classId && screen === "more" && (
              <MoreScreen
                onSelectBosses={() => setScreen("bosses")}
                onSelectProgress={() => setScreen("progress")}
                onSelectAchievements={() => setScreen("achievements")}
                onSelectStrength={() => setScreen("strength")}
                onSelectLegacy={() => setScreen("legacy")}
                onSelectSettings={() => setScreen("settings")}
                onSelectProfile={() => setScreen("profile")}
                onSelectStats={() => setScreen("stats")}
                onSelectSkillTree={() => setScreen("skilltree")}
                level={level}
                rank={rank}
                week={weekNumber}
                phase={program.phase}
                streak={loginStreak}
                body={body}
                mind={mind}
                work={work}
                equippedTitle={equippedTitle}
              />
            )}

            {storageReady && screen === "profile" && profile && (
              <ProfileScreen
                profile={profile}
                level={level}
                onSave={saveProfile}
                onBack={goBackToMore}
                equippedTitle={equippedTitle}
                unlockedTitleIds={unlockedTitleIds}
                defeatedBadges={defeatedBadges}
                onEquipTitle={equipTitle}
              />
            )}

            {storageReady && profile?.classId && screen === "stats" && (
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
                equippedTitle={equippedTitle}
                bossesDefeated={defeatedBosses.length}
                bossesTotal={BOSSES.length}
                bossCompletionPercent={bossCompletionPercent}
                onBack={goBackToMore}
              />
            )}

            {storageReady && profile?.classId && screen === "strength" && (
              <StrengthTrackerScreen onBack={goBackToMore} />
            )}

            {storageReady && profile?.classId && screen === "legacy" && (
              <LegacyScreen
                seasons={completedSeasons}
                onBack={goBackToMore}
              />
            )}

            {storageReady && screen === "skilltree" && profile?.classId && (
              <SkillTreeScreen
                classId={profile.classId}
                level={level}
                onBack={goBackToMore}
              />
            )}

            {storageReady && profile?.classId && screen === "settings" && (
              <SettingsScreen
                onBack={goBackToMore}
                onReset={handleResetProgress}
              />
            )}

            {storageReady && profile?.classId && screen === "bosses" && (
              <BossScreen
                ctx={bossProgressContext}
                currentBoss={currentBoss}
                getStatus={(boss) => getBossStatus(boss, bossProgressContext)}
                onClaimBoss={handleClaimBoss}
                onBack={goBackToMore}
                defeatedCount={defeatedBosses.length}
                completionPercent={bossCompletionPercent}
              />
            )}
          </ScreenTransition>

          {storageReady && profile?.classId && (
            <AppPopups
              placement="inline"
              pendingSeasonComplete={pendingSeasonComplete}
              completedSeasons={completedSeasons}
              onClaimSeason={handleClaimSeason}
              onCloseSeason={clearPending}
            />
          )}
        </div>

        {storageReady && profile?.classId && (
          <>
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
              pendingBossDefeat={pendingBossDefeat}
              bossDefeatXp={bossDefeatXp}
              onCloseBossDefeat={handleCloseBossDefeat}
            />

            <DailyRewardPopup
              isOpen={showDailyReward && canClaim}
              day={rewardDay}
              xpReward={xpReward}
              onClaim={handleClaimDailyReward}
            />

            <BottomNav screen={navScreen} setScreen={setScreen} />
          </>
        )}
      </main>
      )}
    </>
  );
}
