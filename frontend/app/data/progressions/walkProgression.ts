import type { StageBand } from "./types";

export const WALK_LADDER = [5, 10, 15, 20, 30, 45, 60] as const;

function band(from: number, to: number, pool: StageBand["pool"]): StageBand {
  return { fromRung: from, toRung: to, pool };
}

export const WALK_STAGES: StageBand[] = [
  band(0, 5, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "8 min brisk walk", ru: "8 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "walk",
      prescription: { en: "10 min walk", ru: "10 мин ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(5, 10, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "10 min brisk walk", ru: "10 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "12 min brisk walk", ru: "12 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(10, 15, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "12 min brisk walk", ru: "12 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "15 min brisk walk", ru: "15 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(15, 20, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "15 min brisk walk", ru: "15 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "18 min brisk walk", ru: "18 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(20, 30, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "20 min brisk walk", ru: "20 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "25 min brisk walk", ru: "25 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(30, 45, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "30 min brisk walk", ru: "30 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "35 min brisk walk", ru: "35 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
  band(45, 60, [
    {
      exerciseId: "brisk_walk",
      prescription: { en: "45 min brisk walk", ru: "45 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 10,
    },
    {
      exerciseId: "brisk_walk",
      prescription: { en: "50 min brisk walk", ru: "50 мин быстрая ходьба" },
      restSeconds: 0,
      role: "conditioning",
      weight: 9,
    },
  ]),
];

function walkRungs(current: number): { previousRung: number; nextRung: number | null } {
  let previousRung = 0;
  let nextRung: number | null = WALK_LADDER[0] ?? null;
  for (const rung of WALK_LADDER) {
    if (current < rung) {
      nextRung = rung;
      break;
    }
    previousRung = rung;
    nextRung = null;
  }
  return { previousRung, nextRung };
}

export function getWalkStageBand(current: number): StageBand | null {
  const { previousRung, nextRung } = walkRungs(current);

  if (nextRung === null) {
    return WALK_STAGES[WALK_STAGES.length - 1] ?? null;
  }

  return (
    WALK_STAGES.find(
      (s) => s.fromRung === previousRung && s.toRung === nextRung
    ) ??
    WALK_STAGES.find((s) => s.toRung === nextRung) ??
    WALK_STAGES[0] ??
    null
  );
}
