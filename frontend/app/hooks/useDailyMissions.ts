"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

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
    const saved = safeGet("iron-path-daily-missions", null as any);

    const today = new Date().toDateString();

    if (saved) {
      // Reset if it's a new day
      if (saved.date !== today) {
        safeSet("iron-path-daily-missions", { date: today, missions });
      } else {
        setMissions(saved.missions);
      }
    } else {
      // First time - initialize with today's date
      safeSet("iron-path-daily-missions", { date: today, missions });
    }
  }, []);

  // Save to localStorage whenever missions change
  useEffect(() => {
    const today = new Date().toDateString();
    safeSet("iron-path-daily-missions", { date: today, missions });
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
