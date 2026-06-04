import type {
  AssessmentInput,
  AssessmentResult,
  FitnessLevel,
} from "./fitnessAssessment";
import type { DayType } from "./workoutGeneratorV2";

const LEVEL_RANK: Record<FitnessLevel, number> = {
  absolute_beginner: 0,
  beginner: 1,
  novice: 2,
  intermediate: 3,
  advanced: 4,
};

/** i18n keys for focus bullets on start debrief. */
export function getStartDebriefFocusKeys(
  input: AssessmentInput,
  result: AssessmentResult
): string[] {
  const keys: string[] = [];

  if (
    result.upperPullLevel === "absolute_beginner" ||
    result.upperPullLevel === "beginner" ||
    input.maxPullUps <= 3
  ) {
    keys.push("coaching.debrief.focusShouldersBack");
  }

  if (
    result.upperPushLevel === "absolute_beginner" ||
    result.upperPushLevel === "beginner" ||
    input.maxPushUps <= 10
  ) {
    keys.push("coaching.debrief.focusBaseStrength");
  }

  if (
    result.cardioLevel === "absolute_beginner" ||
    result.cardioLevel === "beginner" ||
    input.cardioAccess === "limited" ||
    input.cardioAccess === "none"
  ) {
    keys.push("coaching.debrief.focusEndurance");
  }

  keys.push("coaching.debrief.focusJoints");

  if (keys.length > 5) return keys.slice(0, 5);
  if (keys.length < 3) {
    keys.push("coaching.debrief.focusConsistency");
  }
  return [...new Set(keys)].slice(0, 5);
}

/** i18n keys — why today's / this week's training looks this way. */
export function getTrainingReasonKeys(
  input: AssessmentInput,
  result: AssessmentResult,
  dayType?: DayType
): string[] {
  const keys: string[] = [];

  if (input.maxPullUps <= 2) {
    keys.push("coaching.reason.pullLow");
  }
  if (input.maxPushUps <= 5) {
    keys.push("coaching.reason.pushLow");
  }
  if (
    input.limitations.includes("overweight") ||
    input.weight > 100
  ) {
    keys.push("coaching.reason.overweight");
  }
  if (input.limitations.includes("knees")) {
    keys.push("coaching.reason.knees");
  }
  if (input.limitations.includes("back")) {
    keys.push("coaching.reason.back");
  }
  if (LEVEL_RANK[result.overallLevel] <= LEVEL_RANK.beginner) {
    keys.push("coaching.reason.beginner");
  }
  if (!input.equipment.includes("pull_up_bar")) {
    keys.push("coaching.reason.noBar");
  }
  if (input.cardioAccess === "limited" || input.cardioAccess === "none") {
    keys.push("coaching.reason.cardioLimited");
  }

  if (dayType === "mobility") {
    keys.push("coaching.reason.mobilityDay");
  }
  if (dayType === "easy_run" || dayType === "intervals") {
    keys.push("coaching.reason.cardioDay");
  }

  if (keys.length === 0) {
    keys.push("coaching.reason.balanced");
  }

  return [...new Set(keys)].slice(0, 5);
}

export function getWeeksSinceAssessment(completedAt: string | null): number {
  if (!completedAt) return 0;
  const ms = Date.now() - new Date(completedAt).getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

export function shouldSuggestReassessment(
  completedAt: string | null,
  programWeek: number,
  lastPromptedWeek: number
): boolean {
  if (!completedAt) return false;
  const weeksSince = getWeeksSinceAssessment(completedAt);
  if (weeksSince >= 4) return true;
  if (programWeek >= 4 && programWeek - lastPromptedWeek >= 4) return true;
  return false;
}
