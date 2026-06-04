import type { Equipment } from "./exercises";

export type FitnessGoal = "mass_gain" | "fat_loss" | "runner" | "athletic";

export type Limitation = "knees" | "back" | "shoulders" | "overweight" | "none";

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
  equipment: Equipment[];
  limitations: Limitation[];
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

export function classifyCardioLevel(input: AssessmentInput): FitnessLevel {
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

  return "beginner";
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
    notes: buildSafetyNotes(input),
  };
}
