"use client";

import OnboardingScreen from "./components/OnboardingScreen";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useDailyMissions } from "./hooks/useDailyMissions";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { useGameActions } from "./hooks/useGameActions";
import { useBossTrials } from "./hooks/useBossTrials";
import { useBosses } from "./hooks/useBosses";
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
import {
  applyTelegramTheme,
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
import {
  shouldSuggestAdaptation,
  shouldSuggestReassessment,
} from "./data/trainingCoaching";
import {
  estimateWeeksWithoutProgress,
  resetProgressionState,
  tickProgressionWeek,
} from "./utils/progressionState";
import type { AssessmentInput } from "./data/fitnessAssessment";
import { STORAGE_KEYS } from "./utils/storageKeys";
import { MAX_XP_PER_LEVEL } from "./data/xpRewards";

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
  const [debriefVariant, setDebriefVariant] = useState<"initial" | "reassessment">(
    "initial"
  );
  const [showSplash, setShowSplash] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

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

  useEffect(() => {
    telegramReady();
    telegramExpand();
    applyTelegramTheme();
    const unsubscribeTheme = subscribeTelegramThemeChange();
    return unsubscribeTheme;
  }, []);

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

  const {
    screen,
    setScreen,
    navScreen,
    goBackToMore,
    handleStartAssessment,
    handleStartTraining,
    handleOpenToday,
    handleViewBoss,
    handleAssessmentCancel,
    navigateToDebrief,
    navigateToHero,
  } = useAppNavigation(appReady);

  const {
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
    bossDefeatXp,
  } = useGameActions({
    classId,
    program,
    profile,
    player: {
      xp,
      level,
      week,
      body,
      mind,
      work,
      totalXp,
      workoutCount,
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
    },
    missions: { missions, completeMission },
    bossTrials: {
      pendingTrial,
      completeTrial,
      clearPendingTrial,
      checkForNewTrial,
    },
    bosses: {
      defeatedBosses,
      buildContext,
      defeatBoss,
      clearPendingDefeat,
      recordDeepWork,
      isRequirementMet,
      getPendingDefeatBoss,
    },
    seasons: {
      completedSeasons,
      checkForSeasonComplete,
      completeSeason,
    },
    stats: {
      stats,
      recordMissionComplete,
      recordDailyClaim,
    },
    dailyRewards: { claimReward },
    storageReady,
    canShowDailyReward,
    showSplash,
    showIntro,
    clearProfile,
  });

  const handleAssessmentComplete = useCallback(
    (input: AssessmentInput) => {
      const prevCount = coachingState?.assessmentCompletionCount ?? 0;
      completeAssessment(input);
      onAssessmentCompleted();
      resetProgressionState(input);
      setDebriefVariant(prevCount >= 1 ? "reassessment" : "initial");
      try {
        localStorage.removeItem(STORAGE_KEYS.trainingCalendar);
      } catch {
        // ignore
      }
      navigateToDebrief();
    },
    [
      completeAssessment,
      onAssessmentCompleted,
      coachingState?.assessmentCompletionCount,
      navigateToDebrief,
    ]
  );

  const handleDebriefContinue = useCallback(() => {
    if (debriefVariant === "initial") {
      markDebriefSeen();
    }
    navigateToHero();
  }, [debriefVariant, markDebriefSeen, navigateToHero]);

  useEffect(() => {
    if (!assessmentInput) return;
    tickProgressionWeek(assessmentInput, weekNumber);
  }, [assessmentInput, weekNumber]);

  const weeksWithoutProgress = useMemo(() => {
    if (!assessmentInput) return 0;
    return estimateWeeksWithoutProgress(assessmentInput, weekNumber);
  }, [assessmentInput, weekNumber]);

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
      coachingState?.lastReassessmentPromptDismissWeek ?? 0,
      { weeksWithoutProgress }
    );
  }, [
    assessmentComplete,
    assessmentRecord?.completedAt,
    coachingLoaded,
    coachingState?.lastReassessmentPromptDismissWeek,
    weekNumber,
    weeksWithoutProgress,
  ]);

  const showAdaptationHint = useMemo(() => {
    if (!assessmentComplete || !assessmentInput || showReassessmentPrompt) return false;
    if (weekNumber === (coachingState?.lastReassessmentPromptDismissWeek ?? 0)) {
      return false;
    }
    return shouldSuggestAdaptation(weeksWithoutProgress);
  }, [
    assessmentComplete,
    assessmentInput,
    coachingState?.lastReassessmentPromptDismissWeek,
    showReassessmentPrompt,
    weekNumber,
    weeksWithoutProgress,
  ]);

  const handleDismissReassessment = useCallback(() => {
    dismissReassessment(weekNumber);
  }, [dismissReassessment, weekNumber]);

  const rank = useMemo(() => translateRank(getRank(level), t), [level, t]);

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
      navigateToHero();
    },
    [profile, saveProfile, navigateToHero]
  );

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
                showAdaptationHint={showAdaptationHint}
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
                xp={xp}
                maxXp={MAX_XP_PER_LEVEL}
                streak={loginStreak}
                rank={rank}
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
                onCompleteWeek={handleCompleteWeek}
                assessmentInput={assessmentInput}
                assessmentResult={assessmentResult}
                showReassessmentPrompt={showReassessmentPrompt}
                showAdaptationHint={showAdaptationHint}
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
