import type { Equipment } from "./exercises";
import { normalizeFitnessGoal, type FitnessGoal } from "./fitnessGoals";

export type { FitnessGoal } from "./fitnessGoals";

export type Limitation = "knees" | "back" | "shoulders" | "overweight" | "none";

export type CardioAccess = "outdoor" | "treadmill" | "limited" | "none";

export type CardioPreference = "enjoy" | "neutral" | "dislike";

export type CardioTestType = "run" | "walk" | "skipped";

/** User cannot or prefers not to run (no access, or dislikes running). */
export function shouldAvoidRunning(
  cardioAccess: CardioAccess,
  cardioPreference: CardioPreference
): boolean {
  return cardioAccess === "none" || cardioPreference === "dislike";
}

/** Whether the endurance step may offer a running test. */
export function canOfferRunningTest(
  cardioAccess: CardioAccess | null,
  cardioPreference: CardioPreference | null
): boolean {
  if (cardioAccess === null || cardioPreference === null) return false;
  return !shouldAvoidRunning(cardioAccess, cardioPreference);
}

/** Endurance wizard step is omitted when regular running is unavailable. */
export function shouldSkipEnduranceStep(
  cardioAccess: CardioAccess | null
): boolean {
  return cardioAccess === "none";
}

/** Default endurance test when running is not offered. */
export function getDefaultCardioTestTypeWhenAvoidingRun(
  cardioAccess: CardioAccess
): CardioTestType {
  if (cardioAccess === "none") return "skipped";
  return "walk";
}

export type FitnessLevel =
  | "absolute_beginner"
  | "beginner"
  | "novice"
  | "intermediate"
  | "advanced";

export type AssessmentInput = {
  age: number;
  height: number;
  weight: number;
  goal: FitnessGoal;
  maxPullUps: number;
  maxPushUps: number;
  squatReps2Min: number;
  plankSeconds: number;
  run1kmSeconds?: number;
  walkRun12MinMeters?: number;
  /** New cardio endurance test (optional for legacy saves). */
  cardioTestType?: CardioTestType;
  runMinutes?: number;
  walkMinutes?: number;
  equipment: Equipment[];
  limitations: Limitation[];
  cardioAccess: CardioAccess;
  cardioPreference: CardioPreference;
};

export type PatternLevels = {
  upperPullLevel: FitnessLevel;
  upperPushLevel: FitnessLevel;
  legsLevel: FitnessLevel;
  coreLevel: FitnessLevel;
  cardioLevel: FitnessLevel;
};

export type AssessmentResult = PatternLevels & {
  overallLevel: FitnessLevel;
  cardioAccess: CardioAccess;
  cardioPreference: CardioPreference;
  cardioSummary: { en: string; ru: string };
  notes: { en: string[]; ru: string[] };
};

const LEVEL_ORDER: FitnessLevel[] = [
  "absolute_beginner",
  "beginner",
  "novice",
  "intermediate",
  "advanced",
];

function levelIndex(level: FitnessLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

function indexToLevel(index: number): FitnessLevel {
  const clamped = Math.max(0, Math.min(LEVEL_ORDER.length - 1, index));
  return LEVEL_ORDER[clamped];
}

function scoreToLevel(score: number): FitnessLevel {
  return indexToLevel(score);
}

/** Pull: overweight caps at novice unless 8+ reps */
export function classifyPullLevel(
  maxPullUps: number,
  weight: number
): FitnessLevel {
  let level: FitnessLevel;
  if (maxPullUps <= 0) level = "absolute_beginner";
  else if (maxPullUps <= 3) level = "beginner";
  else if (maxPullUps <= 7) level = "novice";
  else if (maxPullUps <= 12) level = "intermediate";
  else level = "advanced";

  if (weight > 100 && levelIndex(level) > levelIndex("novice") && maxPullUps < 8) {
    level = "novice";
  }
  return level;
}

export function classifyPushLevel(maxPushUps: number): FitnessLevel {
  if (maxPushUps <= 5) return "absolute_beginner";
  if (maxPushUps <= 15) return "beginner";
  if (maxPushUps <= 30) return "novice";
  if (maxPushUps <= 50) return "intermediate";
  return "advanced";
}

export function classifyLegsLevel(squatReps2Min: number): FitnessLevel {
  if (squatReps2Min <= 20) return "absolute_beginner";
  if (squatReps2Min <= 40) return "beginner";
  if (squatReps2Min <= 60) return "novice";
  if (squatReps2Min <= 85) return "intermediate";
  return "advanced";
}

export function classifyCoreLevel(plankSeconds: number): FitnessLevel {
  if (plankSeconds <= 20) return "absolute_beginner";
  if (plankSeconds <= 45) return "beginner";
  if (plankSeconds <= 90) return "novice";
  if (plankSeconds <= 150) return "intermediate";
  return "advanced";
}

export function resolveCardioTestType(input: AssessmentInput): CardioTestType {
  if (input.cardioTestType === "run" && shouldAvoidRunning(input.cardioAccess, input.cardioPreference)) {
    if (input.walkMinutes !== undefined) return "walk";
    return "skipped";
  }
  if (input.cardioTestType) return input.cardioTestType;
  if (input.cardioAccess === "none") return "skipped";
  if (shouldAvoidRunning(input.cardioAccess, input.cardioPreference)) {
    if (input.walkMinutes !== undefined) return "walk";
    return "skipped";
  }
  if (
    input.run1kmSeconds !== undefined ||
    input.walkRun12MinMeters !== undefined
  ) {
    return "run";
  }
  return "skipped";
}

export function getRunningMetricMinutes(input: AssessmentInput): number {
  const testType = resolveCardioTestType(input);

  if (testType === "run" && input.runMinutes !== undefined) {
    return Math.max(0, input.runMinutes);
  }
  if (testType === "walk" && input.walkMinutes !== undefined) {
    return Math.max(0, input.walkMinutes);
  }
  if (testType === "skipped") return 0;

  if (input.run1kmSeconds && input.run1kmSeconds > 0) {
    const paceMin = input.run1kmSeconds / 60;
    if (paceMin <= 6) return 30;
    if (paceMin <= 7) return 20;
    if (paceMin <= 8) return 15;
    if (paceMin <= 10) return 10;
    return 5;
  }

  if (input.walkRun12MinMeters && input.walkRun12MinMeters > 0) {
    const m = input.walkRun12MinMeters;
    if (m >= 2400) return 30;
    if (m >= 2000) return 20;
    if (m >= 1800) return 15;
    if (m >= 1600) return 10;
    if (m >= 1200) return 5;
    return 0;
  }

  if (input.cardioAccess === "none") return 0;
  if (input.cardioPreference === "dislike") return 5;
  if (normalizeFitnessGoal(input.goal) === "running") return 10;
  return 5;
}

export function classifyCardioLevel(input: AssessmentInput): FitnessLevel {
  const testType = resolveCardioTestType(input);

  if (testType === "run" && input.runMinutes !== undefined) {
    const m = input.runMinutes;
    if (m <= 4) return "absolute_beginner";
    if (m <= 9) return "beginner";
    if (m <= 19) return "novice";
    if (m <= 29) return "intermediate";
    return "advanced";
  }

  if (testType === "walk" && input.walkMinutes !== undefined) {
    const m = input.walkMinutes;
    if (m <= 9) return "absolute_beginner";
    if (m <= 14) return "beginner";
    if (m <= 24) return "novice";
    if (m <= 34) return "intermediate";
    return "advanced";
  }

  if (testType === "skipped") return "absolute_beginner";

  if (input.run1kmSeconds !== undefined) {
    const s = input.run1kmSeconds;
    if (s > 480) return "absolute_beginner";
    if (s > 420) return "beginner";
    if (s > 360) return "novice";
    if (s > 300) return "intermediate";
    return "advanced";
  }

  if (input.walkRun12MinMeters !== undefined) {
    const m = input.walkRun12MinMeters;
    if (m < 1200) return "absolute_beginner";
    if (m < 1600) return "beginner";
    if (m < 2000) return "novice";
    if (m < 2400) return "intermediate";
    return "advanced";
  }

  if (input.cardioAccess === "none") return "absolute_beginner";
  if (input.cardioAccess === "limited") return "beginner";
  if (input.cardioPreference === "enjoy") return "novice";
  if (input.cardioPreference === "dislike") return "beginner";
  return "beginner";
}

export function getCardioAvailabilitySummary(input: AssessmentInput): {
  en: string;
  ru: string;
} {
  switch (input.cardioAccess) {
    case "outdoor":
      return {
        en: "Outdoor running is available",
        ru: "Бег на улице доступен",
      };
    case "treadmill":
      return {
        en: "Treadmill running is available",
        ru: "Бег на дорожке доступен",
      };
    case "limited":
      return {
        en: "Running is possible sometimes",
        ru: "Пробежки возможны иногда",
      };
    case "none":
    default:
      return {
        en: "Regular runs are not available",
        ru: "Регулярные пробежки недоступны",
      };
  }
}

export function getOverallLevel(levels: PatternLevels): FitnessLevel {
  const indices = [
    levelIndex(levels.upperPullLevel),
    levelIndex(levels.upperPushLevel),
    levelIndex(levels.legsLevel),
    levelIndex(levels.coreLevel),
    levelIndex(levels.cardioLevel),
  ].sort((a, b) => a - b);

  const median = indices[2];
  let overall = indexToLevel(median);

  const hasAbsoluteBeginner = Object.values(levels).some(
    (l) => l === "absolute_beginner"
  );
  if (
    hasAbsoluteBeginner &&
    levelIndex(overall) > levelIndex("beginner")
  ) {
    overall = "beginner";
  }

  return overall;
}

function buildSafetyNotes(input: AssessmentInput): { en: string[]; ru: string[] } {
  const en: string[] = [];
  const ru: string[] = [];
  const limits = input.limitations.filter((l) => l !== "none");
  const heavy =
    limits.includes("overweight") || input.weight > 100;

  if (heavy) {
    en.push("Prefer walking and low-impact work; avoid jumps until base improves.");
    ru.push("Предпочитай ходьбу и щадящую нагрузку; без прыжков, пока не окрепнет база.");
  }
  if (limits.includes("shoulders")) {
    en.push("Avoid dips, pike push-ups, and high-volume overhead pressing.");
    ru.push("Избегай брусьев, отжиманий в пике и большого объёма над головой.");
  }
  if (limits.includes("knees")) {
    en.push("Avoid jumps, burpees, and deep squat/lunge volume.");
    ru.push("Избегай прыжков, бёрпи и большого объёма глубоких приседов и выпадов.");
  }
  if (limits.includes("back")) {
    en.push("Use caution with loaded rows and intense core flexion.");
    ru.push("Осторожно с тягой с рюкзаком и сильным сгибанием корпуса.");
  }
  if (input.maxPullUps <= 0 && !input.equipment.includes("pull_up_bar")) {
    en.push("No bar: use rows and scapular work until a pull-up bar is available.");
    ru.push("Без турника: тяги и лопаточная работа, пока нет перекладины.");
  }
  if (input.cardioAccess === "none" || resolveCardioTestType(input) === "skipped") {
    en.push("Cardio plan uses walking and low-impact conditioning instead of running.");
    ru.push("Кардио: ходьба и щадящая кондиция вместо бега.");
  }
  if (resolveCardioTestType(input) === "walk") {
    en.push("Endurance builds from brisk walking before continuous running.");
    ru.push("Выносливость наращивается с быстрой ходьбы, затем бег.");
  }
  if (input.cardioPreference === "dislike") {
    en.push("Fewer run days; walking and circuits are preferred.");
    ru.push("Меньше беговых дней; приоритет — ходьба и круговая кондиция.");
  }

  return { en, ru };
}

export function assessFitness(input: AssessmentInput): AssessmentResult {
  const upperPullLevel = classifyPullLevel(input.maxPullUps, input.weight);
  const upperPushLevel = classifyPushLevel(input.maxPushUps);
  const legsLevel = classifyLegsLevel(input.squatReps2Min);
  const coreLevel = classifyCoreLevel(input.plankSeconds);
  const cardioLevel = classifyCardioLevel(input);

  const patternLevels: PatternLevels = {
    upperPullLevel,
    upperPushLevel,
    legsLevel,
    coreLevel,
    cardioLevel,
  };

  return {
    ...patternLevels,
    overallLevel: getOverallLevel(patternLevels),
    cardioAccess: input.cardioAccess,
    cardioPreference: input.cardioPreference,
    cardioSummary: getCardioAvailabilitySummary(input),
    notes: buildSafetyNotes(input),
  };
}
