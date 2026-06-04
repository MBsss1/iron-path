"use client";

import { useCallback, useEffect, useState } from "react";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";

export type PersonalTask = {
  id: string;
  text: string;
  completed: boolean;
};

type StoredDay = {
  date: string;
  tasks: PersonalTask[];
};

function todayKey(): string {
  return new Date().toDateString();
}

function loadForToday(): PersonalTask[] {
  const saved = safeGet<StoredDay | null>(STORAGE_KEYS.dailyPersonalTasks, null);
  if (saved?.date === todayKey() && Array.isArray(saved.tasks)) {
    return saved.tasks;
  }
  return [];
}

export function useDailyPersonalTasks() {
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setTasks(loadForToday());
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.dailyPersonalTasks, {
      date: todayKey(),
      tasks,
    });
  }, [tasks, loaded]);

  const addTask = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((cur) => [
      ...cur,
      {
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: trimmed,
        completed: false,
      },
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((cur) =>
      cur.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((cur) => cur.filter((t) => t.id !== id));
  }, []);

  return { tasks, loaded, addTask, toggleTask, removeTask };
}
