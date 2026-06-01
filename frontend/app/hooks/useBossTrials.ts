"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { BossTrialId, getAvailableTrial } from "../data/bossTrials";

export function useBossTrials() {
  const [completedTrials, setCompletedTrials] = useState<BossTrialId[]>([]);
  const [pendingTrial, setPendingTrial] = useState<BossTrialId | null>(null);

  // Load completed trials from localStorage
  useEffect(() => {
    const saved = safeGet("iron-path-boss-trials", [] as BossTrialId[]);
    if (saved) {
      setCompletedTrials(saved);
    }
  }, []);

  // Save to localStorage whenever completed trials change
  useEffect(() => {
    safeSet("iron-path-boss-trials", completedTrials);
  }, [completedTrials]);

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
    completedTrials,
    pendingTrial,
    completeTrial,
    clearPendingTrial,
    checkForNewTrial,
    isTrialCompleted,
  };
}
