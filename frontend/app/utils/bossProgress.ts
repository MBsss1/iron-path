import {
  BOSSES,
  type BossDefinition,
  type BossId,
  type BossRequirementType,
} from "../data/bosses";

export type BossProgressContext = {
  level: number;
  workoutCount: number;
  missionsCompleted: number;
  deepWorkCount: number;
  currentStreak: number;
  totalXp: number;
  defeatedBossIds: BossId[];
};

export type BossStatus = "locked" | "available" | "ready" | "defeated";

export function getRequirementProgress(
  requirementType: BossRequirementType,
  ctx: BossProgressContext
): number {
  switch (requirementType) {
    case "workouts":
      return ctx.workoutCount;
    case "dailyMissions":
      return ctx.missionsCompleted;
    case "deepWorkSessions":
      return ctx.deepWorkCount;
    case "streakDays":
      return ctx.currentStreak;
    case "totalXp":
      return ctx.totalXp;
    case "allBossesDefeated":
      return ctx.defeatedBossIds.filter((id) => id !== "shadow_self").length;
    default:
      return 0;
  }
}

export function isBossUnlocked(boss: BossDefinition, ctx: BossProgressContext): boolean {
  if (ctx.level < boss.requiredLevel) return false;

  const index = BOSSES.findIndex((b) => b.id === boss.id);
  if (index <= 0) return true;

  const previous = BOSSES[index - 1];
  return ctx.defeatedBossIds.includes(previous.id);
}

export function isRequirementMet(boss: BossDefinition, ctx: BossProgressContext): boolean {
  const current = getRequirementProgress(boss.requirement.type, ctx);
  return current >= boss.requirement.target;
}

export function getBossStatus(boss: BossDefinition, ctx: BossProgressContext): BossStatus {
  if (ctx.defeatedBossIds.includes(boss.id)) return "defeated";
  if (!isBossUnlocked(boss, ctx)) return "locked";
  if (isRequirementMet(boss, ctx)) return "ready";
  return "available";
}

export function getBossProgressPercent(
  boss: BossDefinition,
  ctx: BossProgressContext
): number {
  const current = getRequirementProgress(boss.requirement.type, ctx);
  const target = boss.requirement.target;
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getBossProgressLabel(
  boss: BossDefinition,
  ctx: BossProgressContext
): string {
  const current = getRequirementProgress(boss.requirement.type, ctx);
  const target = boss.requirement.target;

  if (boss.requirement.type === "totalXp") {
    return `${current.toLocaleString()} / ${target.toLocaleString()} XP`;
  }

  if (boss.requirement.type === "allBossesDefeated") {
    return `${current} / ${target} bosses defeated`;
  }

  if (boss.requirement.type === "streakDays") {
    return `${current} / ${target} day streak`;
  }

  return `${current} / ${target}`;
}

export function getCurrentBoss(ctx: BossProgressContext): BossDefinition | null {
  for (const boss of BOSSES) {
    const status = getBossStatus(boss, ctx);
    if (status === "available" || status === "ready") {
      return boss;
    }
  }
  return null;
}

export function getBossCompletionPercent(defeatedBossIds: BossId[]): number {
  if (BOSSES.length === 0) return 0;
  return Math.round((defeatedBossIds.length / BOSSES.length) * 100);
}
