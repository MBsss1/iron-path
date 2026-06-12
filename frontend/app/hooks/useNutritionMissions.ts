"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getNutritionMissionIdsForLevel,
  type NutritionLevel,
} from "../data/nutritionAssessment";
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

const MISSION_NAMES: Record<NutritionMissionId, string> = {
  protein_target: "Protein Target",
  meals_3_plus: "Eat 3+ Meals",
  water_2l: "Drink 2L Water",
  no_junk: "No Junk Food",
};

function buildDefaultMissions(
  ids: NutritionMissionId[]
): NutritionMission[] {
  return ids.map((id) => ({
    id,
    name: MISSION_NAMES[id],
    completed: false,
  }));
}

function loadNutritionMissions(
  missionIds: NutritionMissionId[]
): NutritionMission[] {
  const saved = safeGet<{
    date: string;
    level: NutritionLevel | null;
    missions: NutritionMission[];
  } | null>(STORAGE_KEYS.nutritionMissions, null);
  const today = new Date().toDateString();
  const defaultMissions = buildDefaultMissions(missionIds);

  if (saved?.date !== today) {
    return defaultMissions;
  }

  const allowed = new Set(missionIds);
  const restored = (saved.missions ?? []).filter((mission) =>
    allowed.has(mission.id)
  );

  for (const id of missionIds) {
    if (!restored.some((mission) => mission.id === id)) {
      restored.push({
        id,
        name: MISSION_NAMES[id],
        completed: false,
      });
    }
  }

  return restored;
}

export function useNutritionMissions(nutritionLevel?: NutritionLevel | null) {
  const missionIds = useMemo(
    () => getNutritionMissionIdsForLevel(nutritionLevel),
    [nutritionLevel]
  );

  const [missions, setMissions] = useState<NutritionMission[]>(() =>
    buildDefaultMissions(missionIds)
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadNutritionMissions(missionIds);
    queueMicrotask(() => {
      setMissions(stored);
      setLoaded(true);
    });
  }, [missionIds]);

  useEffect(() => {
    if (!loaded) return;

    const today = new Date().toDateString();
    safeSet(STORAGE_KEYS.nutritionMissions, {
      date: today,
      level: nutritionLevel ?? null,
      missions,
    });
  }, [missions, loaded, nutritionLevel]);

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
    loaded,
  };
}
