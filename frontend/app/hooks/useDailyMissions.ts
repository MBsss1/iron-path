"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type DailyMission = {
  id: "workout" | "deepwork" | "protein" | "sleep";
  name: string;
  completed: boolean;
};

export function useDailyMissions() {
  const [missions, setMissions] = useState<DailyMission[]>([
    { id: "workout", name: "Workout", completed: false },
    { id: "deepwork", name: "Deep Work", completed: false },
    { id: "protein", name: "Protein", completed: false },
    { id: "sleep", name: "Sleep", completed: false },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = safeGet<{ date: string; missions: DailyMission[] } | null>(
      STORAGE_KEYS.dailyMissions,
      null
    );

    const today = new Date().toDateString();

    if (saved?.date && saved.missions) {
      if (saved.date !== today) {
        safeSet(STORAGE_KEYS.dailyMissions, { date: today, missions });
      } else {
        setMissions(saved.missions);
      }
    } else {
      safeSet(STORAGE_KEYS.dailyMissions, { date: today, missions });
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    safeSet(STORAGE_KEYS.dailyMissions, { date: today, missions });
  }, [missions]);

  const completeMission = (id: "workout" | "deepwork" | "protein" | "sleep") => {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === id ? { ...mission, completed: true } : mission
      )
    );
  };

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const progress = (completedCount / totalCount) * 100;

  const resetMissions = () => {
    const resetMissions = missions.map((m) => ({ ...m, completed: false }));

    setMissions(resetMissions);
  };

  return {
    missions,
    completeMission,
    completedCount,
    totalCount,
    progress,
    resetMissions,
  };
}
