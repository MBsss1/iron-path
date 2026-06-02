"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type NutritionMissionId =
  | "protein_target"
  | "meals_3_plus"
  | "water_2l"
  | "no_junk";

export type NutritionMission = {
  id: NutritionMissionId;
  name: string;
  completed: boolean;
};

const DEFAULT_MISSIONS: NutritionMission[] = [
  { id: "protein_target", name: "Protein Target", completed: false },
  { id: "meals_3_plus", name: "Eat 3+ Meals", completed: false },
  { id: "water_2l", name: "Drink 2L Water", completed: false },
  { id: "no_junk", name: "No Junk Food", completed: false },
];

function loadNutritionMissions(): NutritionMission[] {
  const saved = safeGet<{ date: string; missions: NutritionMission[] } | null>(
    STORAGE_KEYS.nutritionMissions,
    null
  );
  const today = new Date().toDateString();

  if (saved?.date === today && saved.missions) {
    return saved.missions;
  }

  return DEFAULT_MISSIONS;
}

export function useNutritionMissions() {
  const [missions, setMissions] = useState<NutritionMission[]>(DEFAULT_MISSIONS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadNutritionMissions();
    queueMicrotask(() => {
      setMissions(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const today = new Date().toDateString();
    safeSet(STORAGE_KEYS.nutritionMissions, { date: today, missions });
  }, [missions, loaded]);

  const completeMission = (id: NutritionMissionId) => {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === id ? { ...mission, completed: true } : mission
      )
    );
  };

  const completedCount = missions.filter((mission) => mission.completed).length;
  const totalCount = missions.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return {
    missions,
    completeMission,
    completedCount,
    totalCount,
    progress,
  };
}
