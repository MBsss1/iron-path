"use client";

import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type StrengthData = {
  pushUps: number;
  prevPushUps?: number;
  dips: number;
  prevDips?: number;
  pullUps: number;
  prevPullUps?: number;
  runDistance: number; // kilometers
  prevRunDistance?: number;
  weight: number; // kg
  prevWeight?: number;
  updatedAt?: string;
};

const DEFAULT: StrengthData = {
  pushUps: 0,
  dips: 0,
  pullUps: 0,
  runDistance: 0,
  weight: 0,
};

export function useStrengthTracker() {
  const [data, setData] = useState<StrengthData>(() =>
    safeGet(STORAGE_KEYS.strength, DEFAULT)
  );

  useEffect(() => {
    safeSet(STORAGE_KEYS.strength, data);
  }, [data]);

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
    safeSet(STORAGE_KEYS.strength, DEFAULT);
  };

  return { data, updateMetric, reset } as const;
}
