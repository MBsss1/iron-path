"use client";

import { useEffect, useState, useCallback } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export const DAILY_REWARD_XP = [50, 75, 100, 125, 150, 200, 300] as const;

export type DailyRewardsData = {
  lastClaimDate: string | null;
  currentStreak: number;
};

function getTodayString() {
  return new Date().toDateString();
}

function wasYesterday(dateStr: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(dateStr).toDateString() === yesterday.toDateString();
}

function evaluateStreak(data: DailyRewardsData): DailyRewardsData {
  const today = getTodayString();
  const streak = data.currentStreak >= 1 && data.currentStreak <= 7 ? data.currentStreak : 1;

  if (!data.lastClaimDate) {
    return { lastClaimDate: null, currentStreak: streak || 1 };
  }

  if (data.lastClaimDate === today) {
    return { ...data, currentStreak: streak };
  }

  if (wasYesterday(data.lastClaimDate)) {
    return { ...data, currentStreak: streak };
  }

  return { lastClaimDate: data.lastClaimDate, currentStreak: 1 };
}

function loadDailyRewards(): DailyRewardsData {
  const saved = safeGet<DailyRewardsData | null>(STORAGE_KEYS.dailyRewards, null);
  const initial: DailyRewardsData = saved ?? {
    lastClaimDate: null,
    currentStreak: 1,
  };
  return evaluateStreak(initial);
}

export function getRewardXpForDay(day: number) {
  const index = Math.min(Math.max(day, 1), 7) - 1;
  return DAILY_REWARD_XP[index];
}

const INITIAL_DAILY_REWARDS: DailyRewardsData = {
  lastClaimDate: null,
  currentStreak: 1,
};

export function useDailyRewards() {
  const [data, setData] = useState<DailyRewardsData>(INITIAL_DAILY_REWARDS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadDailyRewards();
    queueMicrotask(() => {
      setData(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.dailyRewards, data);
  }, [data, loaded]);

  const today = getTodayString();
  const canClaim = loaded && data.lastClaimDate !== today;
  const rewardDay = data.currentStreak;
  const xpReward = getRewardXpForDay(rewardDay);

  const claimReward = useCallback(() => {
    if (data.lastClaimDate === today) return 0;

    const day = data.currentStreak;
    const xp = getRewardXpForDay(day);
    const nextStreak = day === 7 ? 1 : day + 1;

    setData({
      lastClaimDate: today,
      currentStreak: nextStreak,
    });

    return xp;
  }, [data, today]);

  return {
    lastClaimDate: data.lastClaimDate,
    currentStreak: data.currentStreak,
    canClaim,
    rewardDay,
    xpReward,
    claimReward,
  };
}
