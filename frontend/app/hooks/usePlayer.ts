"use client";

import { useEffect, useState } from "react";
import {
  ACHIEVEMENTS,
  type AchievementDefinition,
  type AchievementId,
} from "../data/achievements";
import { safeGet, safeSet } from "../utils/storage";

const MAX_XP = 500;

export function usePlayer() {
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(3);
  const [week, setWeek] = useState(1);
  const [body, setBody] = useState(4);
  const [leveledUp, setLeveledUp] = useState(false);
  const [mind, setMind] = useState(3);
  const [work, setWork] = useState(2);
  const [totalXp, setTotalXp] = useState(120);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<AchievementId[]>([]);
  const [pendingAchievement, setPendingAchievement] = useState<AchievementDefinition | null>(null);

  useEffect(() => {
    const player = safeGet("iron-path-player", null as any);
    if (player) {
      setXp(player.xp ?? 120);
      setLevel(player.level ?? 3);
      setWeek(player.week ?? 1);
      setBody(player.body ?? 4);
      setMind(player.mind ?? 3);
      setWork(player.work ?? 2);
      setTotalXp(player.totalXp ?? player.xp ?? 120);
      setWorkoutCount(player.workoutCount ?? 0);
    }

    const savedAchievements = safeGet("iron-path-achievements", null as any);
    if (savedAchievements) setAchievementsUnlocked(savedAchievements);
  }, []);
  const addMind = (amount: number) => {
    setMind((currentMind) => currentMind + amount);
  };

  const addWork = (amount: number) => {
    setWork((currentWork) => currentWork + amount);
  };

  const unlockAchievement = (id: AchievementId) => {
    if (achievementsUnlocked.includes(id)) {
      return;
    }

    const achievement = ACHIEVEMENTS.find((item) => item.id === id);

    if (!achievement) {
      return;
    }

    setAchievementsUnlocked((current) => [...current, id]);
    setPendingAchievement(achievement);
  };

  const recordWorkout = () => {
    setWorkoutCount((count) => count + 1);
    unlockAchievement("first_workout");
  };

  const clearPendingAchievement = () => {
    setPendingAchievement(null);
  };

  const checkAchievements = () => {
    if (level >= 5) unlockAchievement("level_5");
    if (level >= 10) unlockAchievement("level_10");

    if (week >= 4) unlockAchievement("week_4");
    if (week >= 12) unlockAchievement("week_12");
    if (week >= 24) unlockAchievement("week_24");

    if (totalXp >= 1000) unlockAchievement("xp_1000");
    if (totalXp >= 5000) unlockAchievement("xp_5000");
  };

  useEffect(() => {
    checkAchievements();
  }, [level, week, totalXp]);

  useEffect(() => {
    safeSet("iron-path-player", {
      xp,
      level,
      week,
      body,
      mind,
      work,
      totalXp,
      workoutCount,
    });
  }, [xp, level, week, body, mind, work, totalXp, workoutCount]);

  useEffect(() => {
    safeSet("iron-path-achievements", achievementsUnlocked);
  }, [achievementsUnlocked]);

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
    setXp(120);
    setLevel(3);
    setWeek(1);
    setBody(4);
    setLeveledUp(false);
    setMind(3);
    setWork(2);
    setTotalXp(120);
    setWorkoutCount(0);

    localStorage.setItem(
      "iron-path-player",
      JSON.stringify({
        xp: 120,
        level: 3,
        week: 1,
        body: 4,
        mind: 3,
        work: 2,
        totalXp: 120,
        workoutCount: 0,
      })
    );
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