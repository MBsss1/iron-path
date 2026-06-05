import type { AssessmentInput } from "./fitnessAssessment";
import { resolveCardioTestType } from "./fitnessAssessment";
import { normalizeFitnessGoal } from "./fitnessGoals";
import { getGoalTrackOrder } from "./progressions/goalPriorities";
import { TRACK_PROGRESSIONS } from "./progressions/stagePools";
import type { ProgressionTrackId } from "./progressions/types";
import { metricFromInput } from "./progressions/types";
import { WALK_LADDER } from "./progressions/walkProgression";

export type PhysicalMetricId = ProgressionTrackId;

export type PhysicalMilestoneTrack = {
  id: PhysicalMetricId;
  ladder: number[];
  i18nLabel: string;
  i18nUnit: string;
};

export const PHYSICAL_MILESTONE_TRACKS: PhysicalMilestoneTrack[] =
  TRACK_PROGRESSIONS.map((t) => ({
    id: t.id,
    ladder: t.ladder,
    i18nLabel: t.i18nLabel,
    i18nUnit: t.i18nUnit,
  }));

export type MilestoneProgress = {
  id: PhysicalMetricId;
  current: number;
  previousRung: number;
  nextRung: number | null;
  progressPercent: number;
  i18nLabel: string;
  i18nUnit: string;
  /** Running track: walk / skipped display mode. */
  cardioMode?: "run" | "walk" | "skipped" | "legacy";
};

export type RunningGoalLine = {
  i18nLabelKey: string;
  i18nLineKey: string;
  current: number;
  target: number | null;
  unitKey: string;
  progressPercent: number;
  mode: "run" | "walk" | "skipped" | "legacy";
};

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
    return {
      previousRung: sorted[sorted.length - 1] ?? current,
      nextRung: null,
      progressPercent: 100,
    };
  }

  const span = nextRung - previousRung;
  const progressPercent =
    span <= 0 ? 0 : Math.min(100, Math.round(((current - previousRung) / span) * 100));

  return { previousRung, nextRung, progressPercent };
}

function cardioModeForTrack(
  input: AssessmentInput,
  trackId: PhysicalMetricId
): MilestoneProgress["cardioMode"] {
  if (trackId !== "running") return undefined;
  if (input.cardioTestType) return input.cardioTestType;
  if (input.run1kmSeconds !== undefined || input.walkRun12MinMeters !== undefined) {
    return "legacy";
  }
  return resolveCardioTestType(input);
}

function resolveTrackMetrics(
  input: AssessmentInput,
  track: PhysicalMilestoneTrack
): {
  current: number;
  ladder: number[];
  i18nLabel: string;
  i18nUnit: string;
} {
  const mode = cardioModeForTrack(input, track.id);

  if (track.id === "running" && mode === "walk") {
    return {
      current: input.walkMinutes ?? 0,
      ladder: [...WALK_LADDER],
      i18nLabel: "coaching.milestone.walking",
      i18nUnit: track.i18nUnit,
    };
  }

  if (track.id === "running" && mode === "skipped") {
    return {
      current: 0,
      ladder: track.ladder,
      i18nLabel: "coaching.milestone.walking",
      i18nUnit: track.i18nUnit,
    };
  }

  return {
    current: metricFromInput(input, track.id),
    ladder: track.ladder,
    i18nLabel: track.i18nLabel,
    i18nUnit: track.i18nUnit,
  };
}

export function getPhysicalMilestoneTracks(
  input: AssessmentInput
): MilestoneProgress[] {
  return PHYSICAL_MILESTONE_TRACKS.map((track) => {
    const resolved = resolveTrackMetrics(input, track);
    const { previousRung, nextRung, progressPercent } = getMilestoneProgress(
      resolved.current,
      resolved.ladder
    );
    return {
      id: track.id,
      current: resolved.current,
      previousRung,
      nextRung,
      progressPercent,
      i18nLabel: resolved.i18nLabel,
      i18nUnit: resolved.i18nUnit,
      cardioMode: cardioModeForTrack(input, track.id),
    };
  });
}

export function getRunningGoalLine(input: AssessmentInput): RunningGoalLine | null {
  const track = getPhysicalMilestoneTracks(input).find((t) => t.id === "running");
  if (!track) return null;

  const mode = track.cardioMode ?? "legacy";

  if (mode === "walk") {
    return {
      i18nLabelKey: "coaching.milestone.walking",
      i18nLineKey: "coaching.milestones.walkLine",
      current: track.current,
      target: track.nextRung,
      unitKey: "coaching.milestone.unitMinutes",
      progressPercent: track.progressPercent,
      mode: "walk",
    };
  }

  if (mode === "skipped") {
    return {
      i18nLabelKey: "coaching.milestone.walking",
      i18nLineKey: "coaching.milestones.skippedLine",
      current: 0,
      target: 5,
      unitKey: "coaching.milestone.unitMinutes",
      progressPercent: 0,
      mode: "skipped",
    };
  }

  return {
    i18nLabelKey: "coaching.milestone.running",
    i18nLineKey: "coaching.nextGoal.line",
    current: track.current,
    target: track.nextRung,
    unitKey: track.i18nUnit,
    progressPercent: track.progressPercent,
    mode: mode === "legacy" ? "legacy" : "run",
  };
}

export function shouldShowRunningInHero(input: AssessmentInput): boolean {
  const goal = normalizeFitnessGoal(input.goal);
  return goal === "running" || goal === "weight_loss";
}

export function formatMilestoneGoalText(
  track: MilestoneProgress,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  if (track.id === "running" && track.cardioMode === "walk") {
    return `${t("coaching.milestone.walking")}: ${t("coaching.milestones.walkLine", {
      current: track.current,
      target: track.nextRung ?? 0,
    })}`;
  }
  if (track.id === "running" && track.cardioMode === "skipped") {
    return `${t("coaching.milestone.walking")}: ${t("coaching.milestones.skippedLine")}`;
  }

  return t("coaching.nextGoal.line", {
    metric: t(track.i18nLabel),
    current: track.current,
    target: track.nextRung ?? 0,
    unit: t(track.i18nUnit),
  });
}

export function getHeroMilestoneGoals(
  input: AssessmentInput,
  maxGoals = 4
): MilestoneProgress[] {
  const ordered = getGoalOrderedMilestones(input).filter((m) => m.nextRung !== null);

  if (shouldShowRunningInHero(input)) {
    return ordered.slice(0, maxGoals);
  }

  return ordered.filter((m) => m.id !== "running").slice(0, maxGoals);
}

/** Primary goal = highest-priority incomplete track for user's goal order. */
export function getPrimaryNextMilestone(
  input: AssessmentInput
): MilestoneProgress | null {
  const order = getGoalTrackOrder(normalizeFitnessGoal(input.goal));
  const tracks = getPhysicalMilestoneTracks(input);
  const byId = new Map(tracks.map((t) => [t.id, t]));

  for (const id of order) {
    const track = byId.get(id);
    if (track && track.nextRung !== null) return track;
  }

  return tracks.find((t) => t.nextRung !== null) ?? null;
}

export function getGoalOrderedMilestones(
  input: AssessmentInput
): MilestoneProgress[] {
  const order = getGoalTrackOrder(normalizeFitnessGoal(input.goal));
  const tracks = getPhysicalMilestoneTracks(input);
  const byId = new Map(tracks.map((t) => [t.id, t]));
  return order.map((id) => byId.get(id)!).filter(Boolean);
}
