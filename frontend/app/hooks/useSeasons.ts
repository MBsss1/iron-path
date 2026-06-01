"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";

export type SeasonRecord = {
  id: number;
  completedAt: string;
  week: number;
  xpAtCompletion?: number;
  levelAtCompletion?: number;
  claimed?: boolean;
};

export function useSeasons() {
  const [completedSeasons, setCompletedSeasons] = useState<SeasonRecord[]>([]);
  const [pendingSeasonComplete, setPendingSeasonComplete] = useState<boolean>(false);

  useEffect(() => {
    const saved = safeGet("iron-path-seasons", [] as SeasonRecord[]);
    if (saved) setCompletedSeasons(saved);
  }, []);

  useEffect(() => {
    safeSet("iron-path-seasons", completedSeasons);
  }, [completedSeasons]);

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
