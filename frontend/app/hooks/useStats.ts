"use client";

import { useCallback, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type StatsData = {
  version: 1;
  highestLevel: number;
  totalMissionsCompleted: number;
  startDate: string | null;
  currentLoginStreak: number;
  longestLoginStreak: number;
  lastLoginDate: string | null;
};

const DEFAULT_STATS: StatsData = {
  version: 1,
  highestLevel: 1,
  totalMissionsCompleted: 0,
  startDate: null,
  currentLoginStreak: 0,
  longestLoginStreak: 0,
  lastLoginDate: null,
};

function getTodayString() {
  return new Date().toDateString();
}

function wasYesterday(dateStr: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(dateStr).toDateString() === yesterday.toDateString();
}

function advanceLoginStreakOnClaim(data: StatsData): StatsData {
  const today = getTodayString();

  if (data.lastLoginDate === today) {
    return data;
  }

  let currentLoginStreak: number;

  if (!data.lastLoginDate) {
    currentLoginStreak = 1;
  } else if (wasYesterday(data.lastLoginDate)) {
    currentLoginStreak = data.currentLoginStreak + 1;
  } else {
    currentLoginStreak = 1;
  }

  const longestLoginStreak = Math.max(
    data.longestLoginStreak,
    currentLoginStreak
  );

  return {
    ...data,
    startDate: data.startDate ?? today,
    currentLoginStreak,
    longestLoginStreak,
    lastLoginDate: today,
  };
}

export function useStats(level: number) {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = safeGet<StatsData | null>(STORAGE_KEYS.stats, null);
    setStats(saved ?? DEFAULT_STATS);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.stats, stats);
  }, [stats, loaded]);

  useEffect(() => {
    if (!loaded) return;
    setStats((current) => ({
      ...current,
      highestLevel: Math.max(current.highestLevel, level),
    }));
  }, [level, loaded]);

  const recordMissionComplete = useCallback(() => {
    setStats((current) => ({
      ...current,
      totalMissionsCompleted: current.totalMissionsCompleted + 1,
    }));
  }, []);

  const recordDailyClaim = useCallback(() => {
    setStats((current) => advanceLoginStreakOnClaim(current));
  }, []);

  const daysSinceStart = stats.startDate
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(stats.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return {
    stats,
    daysSinceStart,
    recordMissionComplete,
    recordDailyClaim,
  };
}
