"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ACHIEVEMENTS,
  type AchievementDefinition,
  type AchievementId,
} from "../data/achievements";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

const MAX_XP = 500;

type PlayerData = {
  xp: number;
  level: number;
  week: number;
  body: number;
  mind: number;
  work: number;
  totalXp: number;
  workoutCount: number;
  highestLevel: number;
};

const DEFAULT_PLAYER: PlayerData = {
  xp: 120,
  level: 3,
  week: 1,
  body: 4,
  mind: 3,
  work: 2,
  totalXp: 120,
  workoutCount: 0,
  highestLevel: 3,
};

type StoredPlayerSnapshot = {
  player: PlayerData;
  achievements: AchievementId[];
};

function loadStoredPlayerSnapshot(): StoredPlayerSnapshot {
  const player = safeGet<Partial<PlayerData> | null>(STORAGE_KEYS.player, null);
  const achievements =
    safeGet<AchievementId[] | null>(STORAGE_KEYS.achievements, null) ?? [];

  return {
    player: {
      xp: player?.xp ?? DEFAULT_PLAYER.xp,
      level: player?.level ?? DEFAULT_PLAYER.level,
      week: player?.week ?? DEFAULT_PLAYER.week,
      body: player?.body ?? DEFAULT_PLAYER.body,
      mind: player?.mind ?? DEFAULT_PLAYER.mind,
      work: player?.work ?? DEFAULT_PLAYER.work,
      totalXp: player?.totalXp ?? player?.xp ?? DEFAULT_PLAYER.totalXp,
      workoutCount: player?.workoutCount ?? DEFAULT_PLAYER.workoutCount,
      highestLevel:
        player?.highestLevel ?? player?.level ?? DEFAULT_PLAYER.highestLevel,
    },
    achievements,
  };
}

export function usePlayer() {
  const [snapshot] = useState(loadStoredPlayerSnapshot);

  const [xp, setXp] = useState(snapshot.player.xp);
  const [level, setLevel] = useState(snapshot.player.level);
  const [week, setWeek] = useState(snapshot.player.week);
  const [body, setBody] = useState(snapshot.player.body);
  const [leveledUp, setLeveledUp] = useState(false);
  const [mind, setMind] = useState(snapshot.player.mind);
  const [work, setWork] = useState(snapshot.player.work);
  const [totalXp, setTotalXp] = useState(snapshot.player.totalXp);
  const [workoutCount, setWorkoutCount] = useState(snapshot.player.workoutCount);
  const [highestLevel, setHighestLevel] = useState(snapshot.player.highestLevel);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<AchievementId[]>(
    snapshot.achievements
  );
  const [pendingAchievement, setPendingAchievement] = useState<AchievementDefinition | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setLoaded(true));
  }, []);

  const addMind = (amount: number) => {
    setMind((currentMind) => currentMind + amount);
  };

  const addWork = (amount: number) => {
    setWork((currentWork) => currentWork + amount);
  };

  const unlockAchievement = useCallback((id: AchievementId) => {
    setAchievementsUnlocked((current) => {
      if (current.includes(id)) return current;

      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      if (!achievement) return current;

      setPendingAchievement(achievement);
      return [...current, id];
    });
  }, []);

  const recordWorkout = () => {
    setWorkoutCount((count) => count + 1);
    unlockAchievement("first_workout");
  };

  const clearPendingAchievement = () => {
    setPendingAchievement(null);
  };

  const checkAchievements = useCallback(
    (loginStreak = 0, seasonsCompleted = 0) => {
      if (level >= 5) unlockAchievement("level_5");
      if (level >= 10) unlockAchievement("level_10");
      if (level >= 25) unlockAchievement("level_25");

      if (week >= 4) unlockAchievement("week_4");
      if (week >= 12) unlockAchievement("week_12");
      if (week >= 24) unlockAchievement("week_24");

      if (totalXp >= 1000) unlockAchievement("xp_1000");
      if (totalXp >= 5000) unlockAchievement("xp_5000");

      if (workoutCount >= 100) unlockAchievement("workouts_100");

      if (loginStreak >= 7) unlockAchievement("streak_7");
      if (loginStreak >= 30) unlockAchievement("streak_30");

      if (seasonsCompleted >= 1) {
        unlockAchievement("first_season");
      }
    },
    [level, week, totalXp, workoutCount, unlockAchievement]
  );

  useEffect(() => {
    if (!loaded) return;
    queueMicrotask(() => {
      setHighestLevel((current) => Math.max(current, level));
    });
  }, [level, loaded]);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.player, {
      xp,
      level,
      week,
      body,
      mind,
      work,
      totalXp,
      workoutCount,
      highestLevel: Math.max(highestLevel, level),
    });
  }, [xp, level, week, body, mind, work, totalXp, workoutCount, highestLevel, loaded]);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.achievements, achievementsUnlocked);
  }, [achievementsUnlocked, loaded]);

  const addXp = (amount: number) => {
    const newXp = xp + amount;
    setTotalXp((currentTotalXp) => currentTotalXp + amount);

    if (newXp >= MAX_XP) {
      setLevel((currentLevel) => currentLevel + 1);
      setXp(newXp - MAX_XP);
      setLeveledUp(true);
    } else {
      setXp(newXp);
    }
  };

  const addBody = (amount: number) => {
    setBody((currentBody) => currentBody + amount);
  };

  const nextWeek = () => {
    setWeek((currentWeek) => Math.min(currentWeek + 1, 24));
  };

  const resetPlayer = () => {
    setXp(DEFAULT_PLAYER.xp);
    setLevel(DEFAULT_PLAYER.level);
    setWeek(DEFAULT_PLAYER.week);
    setBody(DEFAULT_PLAYER.body);
    setLeveledUp(false);
    setMind(DEFAULT_PLAYER.mind);
    setWork(DEFAULT_PLAYER.work);
    setTotalXp(DEFAULT_PLAYER.totalXp);
    setWorkoutCount(DEFAULT_PLAYER.workoutCount);
    setHighestLevel(DEFAULT_PLAYER.highestLevel);
    setAchievementsUnlocked([]);
    safeSet(STORAGE_KEYS.player, DEFAULT_PLAYER);
    safeSet(STORAGE_KEYS.achievements, []);
  };

  const clearLevelUp = () => {
    setLeveledUp(false);
  };

  return {
    xp,
    level,
    week,
    body,
    mind,
    work,
    totalXp,
    workoutCount,
    highestLevel,
    achievementsUnlocked,
    pendingAchievement,
    addXp,
    addBody,
    addMind,
    addWork,
    nextWeek,
    leveledUp,
    clearLevelUp,
    resetPlayer,
    recordWorkout,
    clearPendingAchievement,
    checkAchievements,
    unlockAchievement,
  };
}
