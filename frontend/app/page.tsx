"use client";

import OnboardingScreen from "./components/OnboardingScreen";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useProfile, type Profile } from "./hooks/useProfile";
import { generateProgram } from "./data/programGenerator";
import { usePlayer } from "./hooks/usePlayer";
import { getRank } from "./data/ranks";
import BottomNav from "./components/BottomNav";
import TodayScreen from "./components/TodayScreen";
import TrainingScreen from "./components/TrainingScreen";
import NutritionScreen from "./components/NutritionScreen";
import ProgressScreen from "./components/ProgressScreen";
import MoreScreen from "./components/MoreScreen";
import SettingsScreen from "./components/SettingsScreen";
import ProfileScreen from "./components/ProfileScreen";
import PathModeSelectionScreen from "./components/PathModeSelectionScreen";
import {
  applyPathModeToProfile,
  hasPathModeSelected,
  type PathMode,
} from "./data/pathMode";
import BossScreen from "./components/BossScreen";
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
import HeroScreen from "./components/HeroScreen";
import AppPopups from "./components/AppPopups";
import SplashScreen from "./components/SplashScreen";
import IntroExperience from "./components/IntroExperience";
import ScreenTransition from "./components/ScreenTransition";
import { ScreenLoadingSkeleton } from "./components/ui/Skeleton";
import { hasIntroSeen } from "./utils/introStorage";
import XpFloatAnimation from "./components/XpFloatAnimation";
import DailyRewardPopup from "./components/DailyRewardPopup";
import { clearAllGameData } from "./utils/storageKeys";
import {
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
import { translateRank } from "./i18n/labels";
import { useTranslation } from "./i18n/useTranslation";
import LanguageSelectionScreen from "./components/LanguageSelectionScreen";
import FitnessAssessmentScreen from "./components/FitnessAssessmentScreen";
import TrainingStartDebriefScreen from "./components/coaching/TrainingStartDebriefScreen";
import { useFitnessAssessment } from "./hooks/useFitnessAssessment";
import { useCoachingState } from "./hooks/useCoachingState";
import { shouldSuggestReassessment } from "./data/trainingCoaching";
import type { AssessmentInput } from "./data/fitnessAssessment";
import { STORAGE_KEYS } from "./utils/storageKeys";

const MORE_SUB_SCREENS = ["progress", "settings", "profile", "bosses"];

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
  const {
    loaded: assessmentLoaded,
    isComplete: assessmentComplete,
    complete: completeAssessment,
    input: assessmentInput,
    result: assessmentResult,
    record: assessmentRecord,
  } = useFitnessAssessment();
  const {
    loaded: coachingLoaded,
    state: coachingState,
    markDebriefSeen,
    onAssessmentCompleted,
    dismissReassessment,
  } = useCoachingState();
  const classId = profile?.classId;
  const [screen, setScreen] = useState("hero");
  const [debriefVariant, setDebriefVariant] = useState<"initial" | "reassessment">(
    "initial"
  );
  const [showPopup, setShowPopup] = useState(false);
  const [lastXpReward, setLastXpReward] = useState(0);
  const [showWeekPopup, setShowWeekPopup] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [xpFloat, setXpFloat] = useState<number | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [bossDefeatXp, setBossDefeatXp] = useState(0);
  const levelUpBonusApplied = useRef(false);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);
  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  /** Intro first (no splash) for new users; splash only when intro was already seen. */
  useEffect(() => {
    if (!languageLoaded) return;

    if (!languageChosen) {
      setShowIntro(false);
      setShowSplash(false);
      return;
    }

    if (!hasIntroSeen()) {
      setShowSplash(false);
      setShowIntro(true);
      return;
    }

    setShowIntro(false);
    setShowSplash(true);
    const splashTimer = window.setTimeout(() => setShowSplash(false), 1600);
    return () => window.clearTimeout(splashTimer);
  }, [languageLoaded, languageChosen]);
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

  const canShowDailyReward =
    dailyRewardsLoaded &&
    Boolean(profile) &&
    hasPathModeSelected(profile) &&
    workoutCount > 0 &&
    canClaim;


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

  const appReady = storageReady && Boolean(profile && hasPathModeSelected(profile));

  const handleStartAssessment = useCallback(() => {
    setScreen("assessment");
  }, []);

  const handleAssessmentComplete = useCallback(
    (input: AssessmentInput) => {
      const prevCount = coachingState?.assessmentCompletionCount ?? 0;
      completeAssessment(input);
      onAssessmentCompleted();
      setDebriefVariant(prevCount >= 1 ? "reassessment" : "initial");
      try {
        localStorage.removeItem(STORAGE_KEYS.trainingCalendar);
      } catch {
        // ignore
      }
      setScreen("training-debrief");
    },
    [completeAssessment, onAssessmentCompleted, coachingState?.assessmentCompletionCount]
  );

  const handleDebriefContinue = useCallback(() => {
    if (debriefVariant === "initial") {
      markDebriefSeen();
    }
    setScreen("hero");
  }, [debriefVariant, markDebriefSeen]);

  const handleAssessmentCancel = useCallback(() => {
    setScreen("hero");
  }, []);

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

  const showReassessmentPrompt = useMemo(() => {
    if (!assessmentComplete || !assessmentRecord?.completedAt || !coachingLoaded) {
      return false;
    }
    if (weekNumber === (coachingState?.lastReassessmentPromptDismissWeek ?? 0)) {
      return false;
    }
    return shouldSuggestReassessment(
      assessmentRecord.completedAt,
      weekNumber,
      coachingState?.lastReassessmentPromptDismissWeek ?? 0
    );
  }, [
    assessmentComplete,
    assessmentRecord?.completedAt,
    coachingLoaded,
    coachingState?.lastReassessmentPromptDismissWeek,
    weekNumber,
  ]);

  const handleDismissReassessment = useCallback(() => {
    dismissReassessment(weekNumber);
  }, [dismissReassessment, weekNumber]);

  const navScreen = getNavActiveScreen(screen);
  const rank = useMemo(() => translateRank(getRank(level), t), [level, t]);
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

  const handleStartTraining = useCallback(() => setScreen("training"), []);
  const handleOpenToday = useCallback(() => setScreen("today"), []);
  const handleViewBoss = useCallback(() => setScreen("bosses"), []);

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

  const handleOnboardingFinish = useCallback(
    (data: Profile) => {
      saveProfile(data);
    },
    [saveProfile]
  );

  const handleConfirmPathMode = useCallback(
    (selected: PathMode) => {
      if (!profile) return;
      saveProfile(
        applyPathModeToProfile(profile, selected, new Date().toISOString())
      );
      setScreen("hero");
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

      {showIntro && !showSplash && languageChosen && (
        <IntroExperience onComplete={handleIntroComplete} />
      )}

      {!showSplash && !showIntro && languageLoaded && !languageChosen && (
        <LanguageSelectionScreen onSelect={setLocale} />
      )}

      {!showSplash &&
        !showIntro &&
        languageLoaded &&
        languageChosen &&
        !storageReady && (
          <div
            className="fixed inset-0 z-[99] iron-page px-4 pt-24 pb-24"
            aria-busy="true"
            aria-label={t("app.loadingAria")}
          >
            <div className="w-full max-w-md mx-auto">
              <ScreenLoadingSkeleton
                variant={
                  screen === "today"
                    ? "today"
                    : screen === "training"
                      ? "training"
                      : screen === "progress"
                        ? "progress"
                        : "hero"
                }
              />
            </div>
          </div>
        )}

      {languageChosen && xpFloat !== null && (
        <XpFloatAnimation amount={xpFloat} onDone={clearXpFloat} />
      )}

      {languageChosen && !showIntro && (
      <main className="min-h-screen iron-page flex flex-col items-center px-4 sm:px-6 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">
          <div className="text-center mt-4 sm:mt-6 iron-page-header">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-iron-text">
              {t("app.title")}
            </h1>

            <p className="text-xs sm:text-sm mt-2 iron-page-header-sub">{t("app.tagline")}</p>
          </div>

          {profileLoaded && !profile && (
            <OnboardingScreen onFinish={handleOnboardingFinish} />
          )}

          {profileLoaded &&
            profile &&
            !hasPathModeSelected(profile) && (
            <PathModeSelectionScreen onConfirm={handleConfirmPathMode} />
          )}

          {storageReady &&
            assessmentLoaded &&
            profile &&
            hasPathModeSelected(profile) &&
            screen === "assessment" && (
              <FitnessAssessmentScreen
                profile={profile}
                onComplete={handleAssessmentComplete}
                onCancel={handleAssessmentCancel}
              />
            )}

          {storageReady &&
            profile &&
            hasPathModeSelected(profile) &&
            screen === "training-debrief" &&
            assessmentInput &&
            assessmentResult && (
            <TrainingStartDebriefScreen
              input={assessmentInput}
              result={assessmentResult}
              variant={debriefVariant}
              onContinue={handleDebriefContinue}
            />
          )}

          <ScreenTransition screen={screen}>
            {storageReady &&
              assessmentLoaded &&
              profile &&
              hasPathModeSelected(profile) &&
              screen === "hero" && (
              <HeroScreen
                assessmentComplete={assessmentComplete}
                onStartAssessment={handleStartAssessment}
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
                workoutCount={workoutCount}
                workoutMissionCompleted={workoutMissionCompleted}
                equippedTitle={equippedTitle}
                currentBoss={currentBoss}
                bossProgressPercent={bossProgressPercent}
                bossProgressContext={bossProgressContext}
                allBossesDefeated={allBossesDefeated}
                onStartTraining={handleStartTraining}
                onOpenToday={handleOpenToday}
                onViewBoss={handleViewBoss}
                assessmentInput={assessmentInput}
                showReassessmentPrompt={showReassessmentPrompt}
                onRetakeAssessment={handleStartAssessment}
                onDismissReassessment={handleDismissReassessment}
              />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile &&
              hasPathModeSelected(profile) &&
              screen === "today" && (
              <TodayScreen
                program={program}
                classId={classId}
                level={level}
                missions={missions}
                assessmentComplete={assessmentComplete}
                onStartAssessment={handleStartAssessment}
                onCompleteDeepWork={completeDeepWork}
                onCompleteProtein={completeProtein}
                onCompleteSleep={completeSleep}
                onGoToTraining={handleStartTraining}
              />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "training" && (
              <TrainingScreen
                program={program}
                classId={classId}
                level={level}
                assessmentComplete={assessmentComplete}
                onStartAssessment={handleStartAssessment}
                onCompleteWorkout={completeWorkout}
                onCompleteWeek={() => {
                  nextWeek();
                  setShowWeekPopup(true);
                }}
                assessmentInput={assessmentInput}
                assessmentResult={assessmentResult}
                showReassessmentPrompt={showReassessmentPrompt}
                onRetakeAssessment={handleStartAssessment}
                onDismissReassessment={handleDismissReassessment}
              />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "nutrition" && (
              <NutritionScreen goal={profile?.goal} />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "progress" && (
              <ProgressScreen
                level={level}
                rank={rank}
                week={weekNumber}
                phase={program.phase}
                xp={xp}
                maxXp={MAX_XP_PER_LEVEL}
                goal={profile?.goal ?? "unknown"}
                currentStreak={stats.currentLoginStreak}
                longestStreak={stats.longestLoginStreak}
                totalXp={totalXp}
                highestLevel={Math.max(highestLevel, stats.highestLevel)}
                workoutCount={workoutCount}
                missionsCompleted={stats.totalMissionsCompleted}
                daysSinceStart={daysSinceStart}
                achievementsUnlocked={achievementsUnlocked}
                progressInput={achievementProgressInput}
                seasons={completedSeasons}
                onBack={goBackToMore}
              />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "more" && (
              <MoreScreen
                onSelectProfile={() => setScreen("profile")}
                onSelectProgress={() => setScreen("progress")}
                onSelectStages={() => setScreen("bosses")}
                onSelectSettings={() => setScreen("settings")}
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

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "settings" && (
              <SettingsScreen
                onBack={goBackToMore}
                onReset={handleResetProgress}
              />
            )}

            {storageReady &&
              assessmentLoaded &&
              profile && hasPathModeSelected(profile) &&
              screen === "bosses" && (
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

          {storageReady &&
            assessmentLoaded &&
            profile && hasPathModeSelected(profile) && (
            <AppPopups
              placement="inline"
              pendingSeasonComplete={pendingSeasonComplete}
              completedSeasons={completedSeasons}
              onClaimSeason={handleClaimSeason}
              onCloseSeason={clearPending}
            />
          )}
        </div>

        {storageReady &&
          assessmentLoaded &&
          profile && hasPathModeSelected(profile) && (
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
              isOpen={showDailyReward && canShowDailyReward}
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
