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

export function useWeightProgress() {
  const { profile } = useProfile();
  const [data, setData] = useState<WeightProgressData | null>(null);

  useEffect(() => {
    if (!profile?.weight) return;

    const profileWeight = parseFloat(profile.weight);
    if (Number.isNaN(profileWeight)) return;

    const saved = safeGet<WeightProgressData | null>(
      STORAGE_KEYS.weightProgress,
      null
    );

    if (saved && saved.startWeight && saved.history) {
      // Use saved data
      queueMicrotask(() => setData(saved));
    } else {
      // Initialize from profile weight
      const today = new Date().toISOString().split("T")[0];
      const initialized: WeightProgressData = {
        startWeight: profileWeight,
        currentWeight: profileWeight,
        targetWeight: profileWeight + 5, // Default target: +5 kg
        history: [
          {
            date: today,
            weight: profileWeight,
          },
        ],
      };
      safeSet(STORAGE_KEYS.weightProgress, initialized);
      queueMicrotask(() => setData(initialized));
    }
  }, [profile]);

  const updateWeight = (newWeight: number) => {
    if (!data || Number.isNaN(newWeight)) return;

    const today = new Date().toISOString().split("T")[0];
    const lastEntry = data.history[data.history.length - 1];

    // Only add new entry if weight changed or it's a new day
    const updated: WeightProgressData = {
      ...data,
      currentWeight: newWeight,
      history:
        lastEntry.date === today
          ? data.history.map((e) => (e.date === today ? { ...e, weight: newWeight } : e))
          : [...data.history, { date: today, weight: newWeight }],
    };

    safeSet(STORAGE_KEYS.weightProgress, updated);
    setData(updated);
  };

  const setTargetWeight = (target: number) => {
    if (!data || Number.isNaN(target)) return;

    const updated = {
      ...data,
      targetWeight: target,
    };

    safeSet(STORAGE_KEYS.weightProgress, updated);
    setData(updated);
  };

  const reset = () => {
    if (!profile?.weight) return;

    const profileWeight = parseFloat(profile.weight);
    if (Number.isNaN(profileWeight)) return;

    const today = new Date().toISOString().split("T")[0];
    const initialized: WeightProgressData = {
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

    safeSet(STORAGE_KEYS.weightProgress, initialized);
    setData(initialized);
  };

  return {
    data,
    updateWeight,
    setTargetWeight,
    reset,
  };
}
