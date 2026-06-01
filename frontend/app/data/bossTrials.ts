export type BossTrialId = "week_4" | "week_10" | "week_18" | "week_24";

export type BossTrial = {
  id: BossTrialId;
  week: number;
  title: string;
  description: string;
  requirements: string[];
  xpReward: number;
};

export const BOSS_TRIALS: BossTrial[] = [
  {
    id: "week_4",
    week: 4,
    title: "Week 4 Trial",
    description: "The first major milestone. Prove your commitment to the path.",
    requirements: [
      "Complete 4 weeks of training",
      "Maintain discipline and consistency",
      "Reach the foundation phase",
    ],
    xpReward: 500,
  },
  {
    id: "week_10",
    week: 10,
    title: "Week 10 Trial",
    description: "Halfway through the first quarter. Your foundation is strong.",
    requirements: [
      "Complete 10 weeks of training",
      "Master the initial phases",
      "Build unstoppable momentum",
    ],
    xpReward: 1000,
  },
  {
    id: "week_18",
    week: 18,
    title: "Week 18 Trial",
    description:
      "Three quarters of the way. The path tests your resolve and character.",
    requirements: [
      "Complete 18 weeks of training",
      "Perfect your technique and discipline",
      "Become a force of nature",
    ],
    xpReward: 1500,
  },
  {
    id: "week_24",
    week: 24,
    title: "Week 24 Trial",
    description: "The final trial. You have walked the entire Iron Path.",
    requirements: [
      "Complete 24 weeks of training",
      "Master all phases",
      "Achieve the ultimate rank",
    ],
    xpReward: 2000,
  },
];

export function getBossTrialByWeek(week: number): BossTrial | null {
  return BOSS_TRIALS.find((trial) => trial.week === week) ?? null;
}

export function getAvailableTrial(week: number): BossTrial | null {
  if (week >= 4 && week < 10) return BOSS_TRIALS[0];
  if (week >= 10 && week < 18) return BOSS_TRIALS[1];
  if (week >= 18 && week < 24) return BOSS_TRIALS[2];
  if (week >= 24) return BOSS_TRIALS[3];
  return null;
}
