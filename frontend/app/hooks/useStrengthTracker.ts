"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type StrengthData = {
  pushUps: number;
  prevPushUps?: number;
  pullUps: number;
  prevPullUps?: number;
  squatReps: number;
  prevSquatReps?: number;
  plankSeconds: number;
  prevPlankSeconds?: number;
  dips: number;
  prevDips?: number;
  runDistance: number;
  prevRunDistance?: number;
  weight: number;
  prevWeight?: number;
  updatedAt?: string;
};

const DEFAULT: StrengthData = {
  pushUps: 0,
  pullUps: 0,
  squatReps: 0,
  plankSeconds: 0,
  dips: 0,
  runDistance: 0,
  weight: 0,
};

export function useStrengthTracker() {
  const [data, setData] = useState<StrengthData>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = safeGet<Partial<StrengthData> | null>(STORAGE_KEYS.strength, null);
    queueMicrotask(() => {
      setData({ ...DEFAULT, ...stored });
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.strength, data);
  }, [data, loaded]);

  const updateMetric = (metric: keyof StrengthData, value: number) => {
    setData((cur) => {
      const next = { ...cur } as StrengthData;
      const now = new Date().toISOString();

      switch (metric) {
        case "pushUps":
          next.prevPushUps = cur.pushUps;
          next.pushUps = value;
          break;
        case "dips":
          next.prevDips = cur.dips;
          next.dips = value;
          break;
        case "pullUps":
          next.prevPullUps = cur.pullUps;
          next.pullUps = value;
          break;
        case "squatReps":
          next.prevSquatReps = cur.squatReps;
          next.squatReps = value;
          break;
        case "plankSeconds":
          next.prevPlankSeconds = cur.plankSeconds;
          next.plankSeconds = value;
          break;
        case "runDistance":
          next.prevRunDistance = cur.runDistance;
          next.runDistance = value;
          break;
        case "weight":
          next.prevWeight = cur.weight;
          next.weight = value;
          break;
      }

      next.updatedAt = now;
      return next;
    });
  };

  const reset = () => {
    setData(DEFAULT);
  };

  return { data, updateMetric, reset } as const;
}
