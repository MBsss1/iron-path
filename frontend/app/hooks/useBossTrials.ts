"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { BossTrialId, getAvailableTrial } from "../data/bossTrials";
import { STORAGE_KEYS } from "../utils/storageKeys";

export function useBossTrials() {
  const [completedTrials, setCompletedTrials] = useState<BossTrialId[]>([]);
  const [pendingTrial, setPendingTrial] = useState<BossTrialId | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = safeGet(STORAGE_KEYS.bossTrials, [] as BossTrialId[]);
    queueMicrotask(() => {
      setCompletedTrials(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.bossTrials, completedTrials);
  }, [completedTrials, loaded]);

  const completeTrial = (trialId: BossTrialId) => {
    if (!completedTrials.includes(trialId)) {
      setCompletedTrials((current) => [...current, trialId]);
    }

    setPendingTrial(null);
  };

  const clearPendingTrial = () => {
    setPendingTrial(null);
  };

  const checkForNewTrial = (week: number) => {
    const availableTrial = getAvailableTrial(week);

    if (availableTrial && !completedTrials.includes(availableTrial.id)) {
      setPendingTrial(availableTrial.id);
      return availableTrial;
    }

    return null;
  };

  const isTrialCompleted = (trialId: BossTrialId): boolean => {
    return completedTrials.includes(trialId);
  };

  return {
    loaded,
    completedTrials,
    pendingTrial,
    completeTrial,
    clearPendingTrial,
    checkForNewTrial,
    isTrialCompleted,
  };
}
