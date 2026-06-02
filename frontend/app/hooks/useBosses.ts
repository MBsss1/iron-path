"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BOSSES,
  type BossDefinition,
  type BossId,
} from "../data/bosses";
import { safeGet, safeSet } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storageKeys";
import {
  type BossProgressContext,
  getBossCompletionPercent,
  getBossStatus,
  getCurrentBoss,
  isRequirementMet,
} from "../utils/bossProgress";

export type BossSaveData = {
  version: 1;
  defeatedBosses: BossId[];
  deepWorkCount: number;
  equippedTitle: string | null;
  pendingDefeat: BossId | null;
};

const DEFAULT_SAVE: BossSaveData = {
  version: 1,
  defeatedBosses: [],
  deepWorkCount: 0,
  equippedTitle: null,
  pendingDefeat: null,
};

function loadBossSave(): BossSaveData {
  const stored = safeGet<BossSaveData | null>(STORAGE_KEYS.bossV2, null);
  return stored ? { ...DEFAULT_SAVE, ...stored } : DEFAULT_SAVE;
}

export function useBosses() {
  const [save, setSave] = useState<BossSaveData>(DEFAULT_SAVE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadBossSave();
    queueMicrotask(() => {
      setSave(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    safeSet(STORAGE_KEYS.bossV2, save);
  }, [save, loaded]);

  const recordDeepWork = useCallback(() => {
    setSave((current) => ({
      ...current,
      deepWorkCount: current.deepWorkCount + 1,
    }));
  }, []);

  const buildContext = useCallback(
    (stats: {
      level: number;
      workoutCount: number;
      missionsCompleted: number;
      currentStreak: number;
      totalXp: number;
    }): BossProgressContext => ({
      level: stats.level,
      workoutCount: stats.workoutCount,
      missionsCompleted: stats.missionsCompleted,
      deepWorkCount: save.deepWorkCount,
      currentStreak: stats.currentStreak,
      totalXp: stats.totalXp,
      defeatedBossIds: save.defeatedBosses,
    }),
    [save.deepWorkCount, save.defeatedBosses]
  );

  const defeatBoss = useCallback((bossId: BossId) => {
    setSave((current) => {
      if (current.defeatedBosses.includes(bossId)) {
        return { ...current, pendingDefeat: null };
      }

      const boss = BOSSES.find((b) => b.id === bossId);
      const nextDefeated = [...current.defeatedBosses, bossId];
      const autoEquip =
        !current.equippedTitle && boss ? boss.rewards.titleId : current.equippedTitle;

      return {
        ...current,
        defeatedBosses: nextDefeated,
        equippedTitle: autoEquip,
        pendingDefeat: bossId,
      };
    });
  }, []);

  const clearPendingDefeat = useCallback(() => {
    setSave((current) => ({ ...current, pendingDefeat: null }));
  }, []);

  const equipTitle = useCallback((titleId: string | null) => {
    setSave((current) => ({ ...current, equippedTitle: titleId }));
  }, []);

  const isBossDefeated = useCallback(
    (bossId: BossId) => save.defeatedBosses.includes(bossId),
    [save.defeatedBosses]
  );

  const unlockedTitleIds = useMemo(() => {
    return save.defeatedBosses
      .map((id) => BOSSES.find((b) => b.id === id)?.rewards.titleId)
      .filter((id): id is string => Boolean(id));
  }, [save.defeatedBosses]);

  const completionPercent = getBossCompletionPercent(save.defeatedBosses);

  const getPendingDefeatBoss = useCallback((): BossDefinition | null => {
    if (!save.pendingDefeat) return null;
    return BOSSES.find((b) => b.id === save.pendingDefeat) ?? null;
  }, [save.pendingDefeat]);

  const resetBosses = useCallback(() => {
    setSave(DEFAULT_SAVE);
  }, []);

  return {
    save,
    loaded,
    defeatedBosses: save.defeatedBosses,
    equippedTitle: save.equippedTitle,
    unlockedTitleIds,
    completionPercent,
    recordDeepWork,
    buildContext,
    defeatBoss,
    clearPendingDefeat,
    equipTitle,
    isBossDefeated,
    getBossStatus: (boss: BossDefinition, ctx: BossProgressContext) =>
      getBossStatus(boss, ctx),
    getCurrentBoss: (ctx: BossProgressContext) => getCurrentBoss(ctx),
    isRequirementMet: (boss: BossDefinition, ctx: BossProgressContext) =>
      isRequirementMet(boss, ctx),
    getPendingDefeatBoss,
    resetBosses,
  };
}
