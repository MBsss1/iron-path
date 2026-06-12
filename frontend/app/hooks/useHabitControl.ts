"use client";

import { useCallback, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type ControlledHabit = {
  id: string;
  label: string;
};

type HabitControlStore = {
  habits: ControlledHabit[];
  /** habit ids marked slip-free for a given date key */
  slipFreeByDate: Record<string, string[]>;
};

const EMPTY: HabitControlStore = { habits: [], slipFreeByDate: {} };

function todayKey(): string {
  return new Date().toDateString();
}

export function useHabitControl() {
  const [habits, setHabits] = useState<ControlledHabit[]>([]);
  const [slipFreeIds, setSlipFreeIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = safeGet<HabitControlStore | null>(STORAGE_KEYS.habitControl, null);
    const store = saved ?? EMPTY;
    const today = todayKey();
    queueMicrotask(() => {
      setHabits(store.habits);
      setSlipFreeIds(store.slipFreeByDate[today] ?? []);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(
    (nextHabits: ControlledHabit[], nextSlipFree: string[]) => {
      const saved = safeGet<HabitControlStore | null>(STORAGE_KEYS.habitControl, null);
      const store = saved ?? EMPTY;
      const today = todayKey();
      safeSet(STORAGE_KEYS.habitControl, {
        habits: nextHabits,
        slipFreeByDate: {
          ...store.slipFreeByDate,
          [today]: nextSlipFree,
        },
      });
    },
    []
  );

  useEffect(() => {
    if (!loaded) return;
    persist(habits, slipFreeIds);
  }, [habits, slipFreeIds, loaded, persist]);

  const addHabit = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setHabits((cur) => [
      ...cur,
      {
        id: `habit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        label: trimmed,
      },
    ]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((cur) => cur.filter((h) => h.id !== id));
    setSlipFreeIds((cur) => cur.filter((hid) => hid !== id));
  }, []);

  const toggleSlipFreeToday = useCallback((id: string) => {
    setSlipFreeIds((cur) =>
      cur.includes(id) ? cur.filter((hid) => hid !== id) : [...cur, id]
    );
  }, []);

  const isSlipFreeToday = useCallback(
    (id: string) => slipFreeIds.includes(id),
    [slipFreeIds]
  );

  return {
    habits,
    loaded,
    addHabit,
    removeHabit,
    toggleSlipFreeToday,
    isSlipFreeToday,
  };
}
