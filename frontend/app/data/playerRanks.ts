import { MAX_XP_PER_LEVEL } from "./xpRewards";

export type PlayerRankId = "novice" | "student" | "warrior" | "knight" | "champion";

const RANK_THRESHOLDS: { id: PlayerRankId; minLevel: number }[] = [
  { id: "champion", minLevel: 40 },
  { id: "knight", minLevel: 20 },
  { id: "warrior", minLevel: 10 },
  { id: "student", minLevel: 5 },
  { id: "novice", minLevel: 1 },
];

const RANK_AVATAR_FILES: Record<PlayerRankId, string> = {
  novice: "novice.webp",
  student: "student.webp",
  warrior: "warrior.webp",
  knight: "knight.webp",
  champion: "champion.webp",
};

export function getPlayerRank(level: number): PlayerRankId {
  const safeLevel = Math.max(1, Math.floor(level));
  for (const rank of RANK_THRESHOLDS) {
    if (safeLevel >= rank.minLevel) {
      return rank.id;
    }
  }
  return "novice";
}

export function getNextPlayerRank(level: number): PlayerRankId | null {
  const current = getPlayerRank(level);
  const order: PlayerRankId[] = ["novice", "student", "warrior", "knight", "champion"];
  const index = order.indexOf(current);
  if (index < 0 || index >= order.length - 1) {
    return null;
  }
  return order[index + 1];
}

export function getNextRankLevel(level: number): number | null {
  const nextRank = getNextPlayerRank(level);
  if (!nextRank) return null;

  switch (nextRank) {
    case "student":
      return 5;
    case "warrior":
      return 10;
    case "knight":
      return 20;
    case "champion":
      return 40;
    default:
      return null;
  }
}

export function getXpToNextRank(
  level: number,
  xp: number,
  maxXp: number = MAX_XP_PER_LEVEL
): number {
  const nextRankLevel = getNextRankLevel(level);
  if (!nextRankLevel) return 0;

  let total = Math.max(0, maxXp - xp);
  for (let nextLevel = level + 1; nextLevel < nextRankLevel; nextLevel += 1) {
    total += maxXp;
  }
  return total;
}

export function getRankAvatar(level: number): string {
  const rank = getPlayerRank(level);
  return `/avatars/ranks/${RANK_AVATAR_FILES[rank]}`;
}
