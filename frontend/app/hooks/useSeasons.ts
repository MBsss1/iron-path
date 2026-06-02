"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type SeasonRecord = {
  id: number;
  completedAt: string;
  week: number;
  xpAtCompletion?: number;
  levelAtCompletion?: number;
  claimed?: boolean;
};

export function useSeasons() {
  const [completedSeasons, setCompletedSeasons] = useState<SeasonRecord[]>(() =>
    safeGet(STORAGE_KEYS.seasons, [] as SeasonRecord[])
  );
  const [pendingSeasonComplete, setPendingSeasonComplete] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.seasons, completedSeasons);
  }, [completedSeasons, loaded]);

  const checkForSeasonComplete = (week: number) => {
    if (week >= 24) {
      const already = completedSeasons.some((s) => s.week === 24);
      if (!already) {
        setPendingSeasonComplete(true);
        return true;
      }
    }

    return false;
  };

  const completeSeason = (xp?: number, level?: number) => {
    // avoid duplicates
    const already = completedSeasons.some((s) => s.week === 24);
    if (already) return;

    const rec: SeasonRecord = {
      id: completedSeasons.length + 1,
      completedAt: new Date().toISOString(),
      week: 24,
      xpAtCompletion: xp,
      levelAtCompletion: level,
      claimed: true,
    };

    setCompletedSeasons((cur) => [...cur, rec]);
    setPendingSeasonComplete(false);
  };

  const clearPending = () => setPendingSeasonComplete(false);

  return {
    completedSeasons,
    pendingSeasonComplete,
    checkForSeasonComplete,
    completeSeason,
    clearPending,
  };
}
