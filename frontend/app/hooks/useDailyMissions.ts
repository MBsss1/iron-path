"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { getLocalDateKey } from "../utils/localDate";

export type DailyMission = {
  id: "workout" | "deepwork" | "protein" | "sleep";
  name: string;
  completed: boolean;
};

const DEFAULT_MISSIONS: DailyMission[] = [
  { id: "workout", name: "Workout", completed: false },
  { id: "deepwork", name: "Deep Work", completed: false },
  { id: "protein", name: "Protein", completed: false },
  { id: "sleep", name: "Sleep", completed: false },
];

function loadDailyMissions(): DailyMission[] {
  const saved = safeGet<{ date: string; missions: DailyMission[] } | null>(
    STORAGE_KEYS.dailyMissions,
    null
  );
  const todayKey = getLocalDateKey();

  if (saved?.date === todayKey && saved.missions) {
    return saved.missions;
  }

  // Legacy missions stored with Date.toDateString()
  if (saved?.date === new Date().toDateString() && saved.missions) {
    return saved.missions;
  }

  return DEFAULT_MISSIONS;
}

export function useDailyMissions() {
  const [missions, setMissions] = useState<DailyMission[]>(DEFAULT_MISSIONS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadDailyMissions();
    queueMicrotask(() => {
      setMissions(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;

    safeSet(STORAGE_KEYS.dailyMissions, {
      date: getLocalDateKey(),
      missions,
    });
  }, [missions, loaded]);

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
    loaded,
    missions,
    completeMission,
    completedCount,
    totalCount,
    progress,
    resetMissions,
  };
}
