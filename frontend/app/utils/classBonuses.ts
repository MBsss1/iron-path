import type { ClassDefinition, ClassId } from "../data/classes";
import { getClass, isSkillUnlockedAtLevel } from "../data/classes";

export type XpBonusType = "workout" | "deepWork" | "mission" | "all";

function getClassBonusRate(cls: ClassDefinition, xpType: XpBonusType): number {
  if (cls.allXpBonus > 0) return cls.allXpBonus;
  if (xpType === "workout") return cls.workoutXpBonus;
  if (xpType === "deepWork") return cls.deepWorkXpBonus;
  if (xpType === "mission") return cls.missionXpBonus;
  return 0;
}

function getSkill1BonusRate(
  cls: ClassDefinition,
  xpType: XpBonusType
): number {
  const passive = cls.skill1Passive;
  if (passive.allXpBonus > 0) return passive.allXpBonus;
  if (xpType === "workout") return passive.workoutXpBonus;
  if (xpType === "deepWork") return passive.deepWorkXpBonus;
  if (xpType === "mission") return passive.missionXpBonus;
  return 0;
}

export function applyClassXpBonus(
  baseXp: number,
  classId: ClassId | string | undefined | null,
  xpType: XpBonusType,
  level?: number
): number {
  const cls = getClass(classId);
  if (!cls || baseXp <= 0) return baseXp;

  let bonus = getClassBonusRate(cls, xpType);

  const skill1Bonus = getSkill1BonusRate(cls, xpType);
  if (
    level != null &&
    isSkillUnlockedAtLevel(0, level) &&
    skill1Bonus > 0
  ) {
    bonus += skill1Bonus;
  }

  return Math.round(baseXp * (1 + bonus));
}

export function applyClassLevelUpBonus(
  classId: ClassId | string | undefined | null,
  addBody: (n: number) => void,
  addMind: (n: number) => void,
  addWork: (n: number) => void
) {
  const cls = getClass(classId);
  if (!cls) return;

  if (cls.levelUpBody > 0) addBody(cls.levelUpBody);
  if (cls.levelUpMind > 0) addMind(cls.levelUpMind);
  if (cls.levelUpWork > 0) addWork(cls.levelUpWork);
}

export function canChangeClass(classChangedAt: string | null | undefined): boolean {
  if (!classChangedAt) return true;

  const changedAt = new Date(classChangedAt).getTime();
  if (Number.isNaN(changedAt)) return true;

  const cooldownMs = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - changedAt >= cooldownMs;
}

export function daysUntilClassChange(
  classChangedAt: string | null | undefined
): number {
  if (!classChangedAt) return 0;

  const changedAt = new Date(classChangedAt).getTime();
  if (Number.isNaN(changedAt)) return 0;

  const cooldownMs = 30 * 24 * 60 * 60 * 1000;
  const remaining = cooldownMs - (Date.now() - changedAt);
  if (remaining <= 0) return 0;

  return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}
