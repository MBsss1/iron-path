import type { AssessmentInput } from "./fitnessAssessment";

export type PhysicalMetricId = "pullups" | "pushups" | "plank" | "squats";

export type PhysicalMilestoneTrack = {
  id: PhysicalMetricId;
  ladder: number[];
  i18nLabel: string;
  i18nUnit: string;
};

export const PHYSICAL_MILESTONE_TRACKS: PhysicalMilestoneTrack[] = [
  { id: "pullups", ladder: [1, 3, 5, 8, 10, 15], i18nLabel: "coaching.milestone.pullups", i18nUnit: "coaching.milestone.unitReps" },
  { id: "pushups", ladder: [5, 10, 20, 30, 50], i18nLabel: "coaching.milestone.pushups", i18nUnit: "coaching.milestone.unitReps" },
  { id: "plank", ladder: [30, 60, 90, 120], i18nLabel: "coaching.milestone.plank", i18nUnit: "coaching.milestone.unitSeconds" },
  { id: "squats", ladder: [20, 40, 60, 80], i18nLabel: "coaching.milestone.squats", i18nUnit: "coaching.milestone.unitReps" },
];

export type MilestoneProgress = {
  id: PhysicalMetricId;
  current: number;
  previousRung: number;
  nextRung: number | null;
  progressPercent: number;
  i18nLabel: string;
  i18nUnit: string;
};

function metricValue(input: AssessmentInput, id: PhysicalMetricId): number {
  switch (id) {
    case "pullups":
      return input.maxPullUps;
    case "pushups":
      return input.maxPushUps;
    case "plank":
      return input.plankSeconds;
    case "squats":
      return input.squatReps2Min;
  }
}

export function getMilestoneProgress(
  current: number,
  ladder: number[]
): { previousRung: number; nextRung: number | null; progressPercent: number } {
  const sorted = [...ladder].sort((a, b) => a - b);
  let previousRung = 0;
  let nextRung: number | null = sorted[0] ?? null;

  for (const rung of sorted) {
    if (current < rung) {
      nextRung = rung;
      break;
    }
    previousRung = rung;
    nextRung = null;
  }

  if (nextRung === null) {
    return { previousRung: sorted[sorted.length - 1] ?? current, nextRung: null, progressPercent: 100 };
  }

  const span = nextRung - previousRung;
  const progressPercent =
    span <= 0 ? 0 : Math.min(100, Math.round(((current - previousRung) / span) * 100));

  return { previousRung, nextRung, progressPercent };
}

export function getPhysicalMilestoneTracks(
  input: AssessmentInput
): MilestoneProgress[] {
  return PHYSICAL_MILESTONE_TRACKS.map((track) => {
    const current = metricValue(input, track.id);
    const { previousRung, nextRung, progressPercent } = getMilestoneProgress(
      current,
      track.ladder
    );
    return {
      id: track.id,
      current,
      previousRung,
      nextRung,
      progressPercent,
      i18nLabel: track.i18nLabel,
      i18nUnit: track.i18nUnit,
    };
  });
}

/** Primary goal = track with lowest progress toward next rung (excluding maxed). */
export function getPrimaryNextMilestone(
  input: AssessmentInput
): MilestoneProgress | null {
  const tracks = getPhysicalMilestoneTracks(input).filter((t) => t.nextRung !== null);
  if (tracks.length === 0) return null;
  return tracks.reduce((a, b) =>
    a.progressPercent <= b.progressPercent ? a : b
  );
}
