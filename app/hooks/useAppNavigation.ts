"use client";

import { useCallback, useEffect, useState } from "react";
import {
  configureTelegramBackButton,
  getTelegramBackButtonTarget,
} from "../utils/telegram";

export const MORE_SUB_SCREENS = ["progress", "settings", "profile", "bosses"];

export function getNavActiveScreen(screen: string) {
  return MORE_SUB_SCREENS.includes(screen) ? "more" : screen;
}

export function useAppNavigation(appReady: boolean) {
  const [screen, setScreen] = useState("hero");

  const navScreen = getNavActiveScreen(screen);

  const goBackToMore = useCallback(() => setScreen("more"), []);

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

  useEffect(() => {
    const visible =
      appReady && getTelegramBackButtonTarget(screen, MORE_SUB_SCREENS) !== null;
    return configureTelegramBackButton({
      visible,
      onClick: handleTelegramBack,
    });
  }, [appReady, screen, handleTelegramBack]);

  const handleStartAssessment = useCallback(() => setScreen("assessment"), []);

  const handleStartTraining = useCallback(() => setScreen("training"), []);

  const handleOpenToday = useCallback(() => setScreen("today"), []);

  const handleViewBoss = useCallback(() => setScreen("bosses"), []);

  const handleAssessmentCancel = useCallback(() => setScreen("hero"), []);

  const navigateToDebrief = useCallback(() => setScreen("training-debrief"), []);

  const navigateToHero = useCallback(() => setScreen("hero"), []);

  return {
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
  };
}
