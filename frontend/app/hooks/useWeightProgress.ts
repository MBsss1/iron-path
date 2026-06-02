"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { useProfile } from "./useProfile";

export type WeightEntry = {
  date: string; // ISO date string
  weight: number;
};

export type WeightProgressData = {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  history: WeightEntry[];
};

function createInitialWeightProgress(profileWeight: number): WeightProgressData {
  const today = new Date().toISOString().split("T")[0];
  return {
    startWeight: profileWeight,
    currentWeight: profileWeight,
    targetWeight: profileWeight + 5,
    history: [
      {
        date: today,
        weight: profileWeight,
      },
    ],
  };
}

export function useWeightProgress() {
  const { profile } = useProfile();
  const [data, setData] = useState<WeightProgressData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!profile?.weight) return;

    const profileWeight = parseFloat(profile.weight);
    if (Number.isNaN(profileWeight)) return;

    const saved = safeGet<WeightProgressData | null>(
      STORAGE_KEYS.weightProgress,
      null
    );

    queueMicrotask(() => {
      if (saved && saved.startWeight && saved.history) {
        setData(saved);
      } else {
        setData(createInitialWeightProgress(profileWeight));
      }
      setLoaded(true);
    });
  }, [profile]);

  useEffect(() => {
    if (!loaded || !data) return;
    safeSet(STORAGE_KEYS.weightProgress, data);
  }, [data, loaded]);

  const updateWeight = (newWeight: number) => {
    if (!data || Number.isNaN(newWeight)) return;

    const today = new Date().toISOString().split("T")[0];
    const lastEntry = data.history[data.history.length - 1];

    const updated: WeightProgressData = {
      ...data,
      currentWeight: newWeight,
      history:
        lastEntry.date === today
          ? data.history.map((e) => (e.date === today ? { ...e, weight: newWeight } : e))
          : [...data.history, { date: today, weight: newWeight }],
    };

    setData(updated);
  };

  const setTargetWeight = (target: number) => {
    if (!data || Number.isNaN(target)) return;

    setData({
      ...data,
      targetWeight: target,
    });
  };

  const reset = () => {
    if (!profile?.weight) return;

    const profileWeight = parseFloat(profile.weight);
    if (Number.isNaN(profileWeight)) return;

    setData(createInitialWeightProgress(profileWeight));
  };

  return {
    data,
    updateWeight,
    setTargetWeight,
    reset,
  };
}
