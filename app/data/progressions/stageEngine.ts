import type { AssessmentInput } from "../fitnessAssessment";
import { getMilestoneProgress } from "../physicalMilestones";
import { getTrackProgression, TRACK_PROGRESSIONS } from "./stagePools";
import type { ProgressionTrackId, StageBand, StageSnapshot } from "./types";
import { isWalkCardioMode, metricFromInput } from "./types";
import { getWalkStageBand } from "./walkProgression";

export function getStageBand(
  trackId: ProgressionTrackId,
  current: number,
  input?: AssessmentInput
): StageBand | null {
  if (trackId === "running" && input && isWalkCardioMode(input)) {
    return getWalkStageBand(current);
  }

  const track = getTrackProgression(trackId);
  const { previousRung, nextRung } = getMilestoneProgress(current, track.ladder);

  if (nextRung === null) {
    const last = track.ladder[track.ladder.length - 1];
    return (
      track.stages.find((s) => s.toRung === last) ??
      track.stages[track.stages.length - 1] ??
      null
    );
  }

  return (
    track.stages.find(
      (s) => s.fromRung === previousRung && s.toRung === nextRung
    ) ??
    track.stages.find((s) => s.toRung === nextRung) ??
    track.stages[0] ??
    null
  );
}

export function getStageSnapshot(
  input: AssessmentInput,
  trackId: ProgressionTrackId
): StageSnapshot {
  const track = getTrackProgression(trackId);
  const current = metricFromInput(input, trackId);
  const { previousRung, nextRung, progressPercent } = getMilestoneProgress(
    current,
    track.ladder
  );

  return {
    trackId,
    current,
    fromRung: previousRung,
    toRung: nextRung,
    progressPercent,
    i18nLabel: track.i18nLabel,
    i18nUnit: track.i18nUnit,
  };
}

export function getAllStageSnapshots(
  input: AssessmentInput
): StageSnapshot[] {
  return TRACK_PROGRESSIONS.map((t) => getStageSnapshot(input, t.id));
}

export function countMilestonesReadyForAdvance(
  previous: AssessmentInput,
  next: AssessmentInput
): number {
  let count = 0;
  for (const track of TRACK_PROGRESSIONS) {
    const before = getStageSnapshot(previous, track.id);
    const after = getStageSnapshot(next, track.id);
    if (
      before.toRung !== null &&
      after.current >= before.toRung &&
      after.fromRung >= before.fromRung
    ) {
      count += 1;
    }
  }
  return count;
}

export function hasStuckOnPrimaryTrack(
  input: AssessmentInput,
  weeksWithoutProgress: number
): boolean {
  return weeksWithoutProgress >= 3;
}
