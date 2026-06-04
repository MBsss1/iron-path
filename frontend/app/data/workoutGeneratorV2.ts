import {
  getExercise,
  type Equipment,
  type Exercise,
  type ExerciseLevel,
  type LocalizedText,
} from "./exercises";
import {
  assessFitness,
  type AssessmentInput,
  type AssessmentResult,
  type CardioAccess,
  type FitnessGoal,
  type FitnessLevel,
  type Limitation,
} from "./fitnessAssessment";
import type { PathMode } from "./pathMode";

export type { AssessmentInput, AssessmentResult } from "./fitnessAssessment";
export { assessFitness } from "./fitnessAssessment";
export { EXERCISES, getExercise } from "./exercises";

export type DayType =
  | "full_body"
  | "push"
  | "pull"
  | "legs"
  | "easy_run"
  | "intervals"
  | "mobility";

export type GeneratedExercise = {
  exerciseId: string;
  name: LocalizedText;
  prescription: LocalizedText;
  restSeconds: number;
  notes?: LocalizedText;
};

export type WorkoutBlock = {
  title: LocalizedText;
  items: GeneratedExercise[];
};

export type GeneratedWorkout = {
  id: string;
  title: LocalizedText;
  goal: FitnessGoal;
  level: FitnessLevel;
  dayType: DayType;
  estimatedMinutes: number;
  blocks: {
    warmup: WorkoutBlock;
    mainWork: WorkoutBlock;
    accessoryWork: WorkoutBlock;
    conditioning?: WorkoutBlock;
    cooldown: WorkoutBlock;
  };
};

export type WeekDaySlot = {
  dayIndex: number;
  dayType: DayType;
  workout: GeneratedWorkout | null;
};

export type WeekPlan = {
  goal: FitnessGoal;
  level: FitnessLevel;
  days: WeekDaySlot[];
};

const LEVEL_RANK: Record<FitnessLevel, number> = {
  absolute_beginner: 0,
  beginner: 1,
  novice: 2,
  intermediate: 3,
  advanced: 4,
};

type GeneratorContext = {
  input: AssessmentInput;
  result: AssessmentResult;
  dayType: DayType;
  pathMode: PathMode;
};

function hasLimitation(ctx: GeneratorContext, id: Limitation): boolean {
  return ctx.input.limitations.includes(id);
}

function hasEquipment(ctx: GeneratorContext, eq: Equipment): boolean {
  return ctx.input.equipment.includes(eq);
}

function isHighImpactBlocked(ctx: GeneratorContext): boolean {
  return (
    hasLimitation(ctx, "knees") ||
    hasLimitation(ctx, "overweight") ||
    ctx.input.weight > 100
  );
}

function isShoulderLimited(ctx: GeneratorContext): boolean {
  return hasLimitation(ctx, "shoulders");
}

function isRunningDayType(dayType: DayType): boolean {
  return dayType === "easy_run" || dayType === "intervals";
}

function countRunningDays(days: DayType[]): number {
  return days.filter(isRunningDayType).length;
}

/** Adjust weekly slots from cardio access and preference (no extra physical tests). */
export function applyCardioWeekTemplate(
  template: DayType[],
  input: Pick<AssessmentInput, "cardioAccess" | "cardioPreference" | "goal">
): DayType[] {
  let days = [...template];

  if (input.cardioAccess === "none") {
    return days.map((d) => (isRunningDayType(d) ? "full_body" : d));
  }

  if (input.cardioAccess === "limited") {
    let cardioUsed = 0;
    days = days.map((d) => {
      if (!isRunningDayType(d)) return d;
      cardioUsed += 1;
      return cardioUsed > 1 ? "full_body" : d;
    });
  }

  if (input.cardioPreference === "dislike") {
    const runIndices: number[] = [];
    days.forEach((d, i) => {
      if (isRunningDayType(d)) runIndices.push(i);
    });
    if (runIndices.length > 1) {
      const maxKeep =
        input.cardioAccess === "limited"
          ? 1
          : Math.max(1, Math.floor(runIndices.length / 2));
      const replace = new Set(runIndices.slice(maxKeep));
      days = days.map((d, i) => (replace.has(i) ? "full_body" : d));
    }
  }

  if (
    input.cardioPreference === "enjoy" &&
    (input.cardioAccess === "outdoor" || input.cardioAccess === "treadmill")
  ) {
    if (
      countRunningDays(days) === 0 &&
      (input.goal === "runner" || input.goal === "fat_loss")
    ) {
      const idx = days.findIndex((d) => d === "full_body");
      if (idx >= 0) days[idx] = "easy_run";
    }
  }

  return days;
}

function allowsRunningWorkouts(access: CardioAccess): boolean {
  return access !== "none";
}

function pickNoRunConditioning(ctx: GeneratorContext): GeneratedExercise[] {
  const climbers = getExercise("mountain_climbers");
  if (
    !isHighImpactBlocked(ctx) &&
    climbers &&
    canUseExercise(ctx, climbers)
  ) {
    return [
      gen("walk", "10 min", "10 мин", 0),
      gen("low_impact_conditioning", "3 rounds", "3 круга", 0),
    ];
  }
  return [
    gen("walk", "12 min", "12 мин", 0),
    gen("brisk_walk", "5 min", "5 мин", 0),
  ];
}

function canUseExercise(ctx: GeneratorContext, exercise: Exercise): boolean {
  if (exercise.contraindications) {
    for (const c of exercise.contraindications) {
      if (c !== "none" && hasLimitation(ctx, c as Limitation)) return false;
    }
  }
  if (isHighImpactBlocked(ctx)) {
    const blocked = ["jumping_jacks", "burpees", "mountain_climbers"];
    if (blocked.includes(exercise.id)) return false;
  }
  if (isShoulderLimited(ctx)) {
    if (exercise.id === "dips" || exercise.id === "pike_pushups") return false;
  }
  if (!hasEquipment(ctx, "pull_up_bar")) {
    const needsBar = [
      "dead_hang",
      "scapular_pullups",
      "negative_pullups",
      "assisted_pullups",
      "pullups",
      "chinups",
      "scapular_pulls",
      "hanging_knee_raises",
    ];
    if (needsBar.includes(exercise.id)) return false;
  }
  if (!hasEquipment(ctx, "parallel_bars") && exercise.id === "dips") {
    return false;
  }
  if (!hasEquipment(ctx, "backpack") && exercise.id === "backpack_rows") {
    return false;
  }
  const needs = exercise.equipment.filter((e) => e !== "none");
  if (needs.length > 0) {
    const ok = needs.some((e) => hasEquipment(ctx, e));
    if (!ok) return false;
  }
  return true;
}

function toGenerated(
  exerciseId: string,
  prescription: LocalizedText,
  restSeconds: number,
  notes?: LocalizedText
): GeneratedExercise {
  const ex = getExercise(exerciseId);
  return {
    exerciseId,
    name: ex?.name ?? { en: exerciseId, ru: exerciseId },
    prescription,
    restSeconds,
    notes,
  };
}

function gen(
  exerciseId: string,
  en: string,
  ru: string,
  restSeconds = 60,
  notes?: LocalizedText
): GeneratedExercise {
  return toGenerated(exerciseId, { en, ru }, restSeconds, notes);
}

export function selectWarmupExercises(ctx: GeneratorContext): GeneratedExercise[] {
  const items: GeneratedExercise[] = [];
  const add = (id: string, en: string, ru: string, rest = 0) => {
    const ex = getExercise(id);
    if (!ex || !canUseExercise(ctx, ex)) return;
    items.push(toGenerated(id, { en, ru }, rest));
  };

  add("arm_circles", "2 × 10 each direction", "2 × 10 в каждую сторону");
  add("shoulder_rolls", "8 forward, 8 back", "8 вперёд, 8 назад");
  add("hip_circles", "8 each direction", "8 в каждую сторону");

  if (
    isRunningDayType(ctx.dayType) &&
    allowsRunningWorkouts(ctx.input.cardioAccess)
  ) {
    add("brisk_walk", "3 min", "3 мин", 0);
  } else if (!isHighImpactBlocked(ctx)) {
    add("jumping_jacks", "30 sec", "30 сек", 0);
  } else {
    add("brisk_walk", "3 min", "3 мин", 0);
  }

  if (ctx.dayType === "push" || ctx.dayType === "full_body") {
    add("incline_pushup_warmup", "2 × 8", "2 × 8", 45);
  }
  if (
    (ctx.dayType === "pull" || ctx.dayType === "full_body") &&
    hasEquipment(ctx, "pull_up_bar")
  ) {
    add("scapular_pulls", "2 × 8", "2 × 8", 45);
  }

  return items.slice(0, 6);
}

export function selectCooldownExercises(ctx: GeneratorContext): GeneratedExercise[] {
  const items: GeneratedExercise[] = [];
  const add = (id: string, en: string, ru: string) => {
    const ex = getExercise(id);
    if (!ex || !canUseExercise(ctx, ex)) return;
    items.push(toGenerated(id, { en, ru }, 0));
  };

  add("child_pose", "45–60 sec", "45–60 сек");
  add("hamstring_stretch", "30 sec each side", "30 сек на сторону");
  add("quad_stretch", "30 sec each leg", "30 сек на ногу");
  add("chest_stretch", "30 sec each side", "30 сек на сторону");
  add("lat_stretch", "30 sec each side", "30 сек на сторону");
  add("calf_stretch", "30 sec each leg", "30 сек на ногу");

  if (
    isRunningDayType(ctx.dayType) &&
    allowsRunningWorkouts(ctx.input.cardioAccess)
  ) {
    add("walk", "3 min easy", "3 мин спокойно");
  }

  return items.slice(0, 6);
}

function pickPullMain(ctx: GeneratorContext): GeneratedExercise[] {
  const level = ctx.result.upperPullLevel;
  const items: GeneratedExercise[] = [];

  if (level === "absolute_beginner") {
    if (hasEquipment(ctx, "pull_up_bar")) {
      items.push(gen("dead_hang", "3 × 20–30 sec", "3 × 20–30 сек", 60));
      items.push(gen("scapular_pullups", "3 × 8", "3 × 8", 60));
    }
    items.push(gen("australian_rows", "3 × 8–10", "3 × 8–10", 75));
    if (hasEquipment(ctx, "backpack") && !hasLimitation(ctx, "back")) {
      items.push(gen("backpack_rows", "3 × 12", "3 × 12", 60));
    }
    return items;
  }

  if (level === "beginner") {
    if (hasEquipment(ctx, "pull_up_bar")) {
      items.push(gen("negative_pullups", "3 × 4", "3 × 4", 90));
    }
    items.push(gen("australian_rows", "3 × 10–12", "3 × 10–12", 75));
    return items;
  }

  if (hasEquipment(ctx, "pull_up_bar")) {
    if (LEVEL_RANK[level] >= LEVEL_RANK.intermediate) {
      items.push(gen("pullups", "4 × 6–8", "4 × 6–8", 90));
    } else {
      items.push(gen("pullups", "3 × 5–8", "3 × 5–8", 90));
    }
    items.push(gen("australian_rows", "3 × 10", "3 × 10", 75));
  } else {
    items.push(gen("australian_rows", "4 × 10–12", "4 × 10–12", 75));
    if (hasEquipment(ctx, "backpack")) {
      items.push(gen("backpack_rows", "3 × 12", "3 × 12", 60));
    }
  }
  return items;
}

function pickPushMain(ctx: GeneratorContext): GeneratedExercise[] {
  const level = ctx.result.upperPushLevel;
  const items: GeneratedExercise[] = [];

  if (level === "absolute_beginner") {
    items.push(gen("wall_pushups", "3 × 12", "3 × 12", 45));
    items.push(gen("incline_pushups", "3 × 8–10", "3 × 8–10", 60));
    return items;
  }
  if (level === "beginner") {
    items.push(gen("knee_pushups", "3 × 10", "3 × 10", 60));
    items.push(gen("incline_pushups", "3 × 10", "3 × 10", 60));
    return items;
  }

  items.push(gen("pushups", "4 × 10–15", "4 × 10–15", 75));
  if (LEVEL_RANK[level] >= LEVEL_RANK.intermediate && !isShoulderLimited(ctx)) {
    items.push(gen("decline_pushups", "3 × 8", "3 × 8", 75));
  }
  if (
    hasEquipment(ctx, "parallel_bars") &&
    LEVEL_RANK[level] >= LEVEL_RANK.novice &&
    !isShoulderLimited(ctx)
  ) {
    items.push(gen("dips", "3 × 6–8", "3 × 6–8", 90));
  }
  return items;
}

function pickLegsMain(ctx: GeneratorContext): GeneratedExercise[] {
  const level = ctx.result.legsLevel;
  const kneeCare = hasLimitation(ctx, "knees");
  const items: GeneratedExercise[] = [];

  if (level === "absolute_beginner" || kneeCare) {
    items.push(gen("chair_squats", "3 × 12", "3 × 12", 60));
    items.push(gen("step_ups", "3 × 10 each leg", "3 × 10 на ногу", 60));
    items.push(gen("calf_raises", "3 × 15", "3 × 15", 45));
    return items;
  }

  items.push(gen("bodyweight_squats", "4 × 15–20", "4 × 15–20", 60));
  if (LEVEL_RANK[level] >= LEVEL_RANK.novice && !kneeCare) {
    items.push(gen("lunges", "3 × 10 each leg", "3 × 10 на ногу", 75));
  }
  if (LEVEL_RANK[level] >= LEVEL_RANK.intermediate && !kneeCare) {
    items.push(gen("split_squats", "3 × 8 each leg", "3 × 8 на ногу", 75));
  }
  return items;
}

export function selectMainExercises(ctx: GeneratorContext): GeneratedExercise[] {
  switch (ctx.dayType) {
    case "pull":
      return pickPullMain(ctx);
    case "push":
      return pickPushMain(ctx);
    case "legs":
      return pickLegsMain(ctx);
    case "full_body": {
      const pull = pickPullMain(ctx).slice(0, 2);
      const push = pickPushMain(ctx).slice(0, 2);
      const legs = pickLegsMain(ctx).slice(0, 1);
      return [...push, ...pull, ...legs];
    }
    case "easy_run":
      return [
        gen("bodyweight_squats", "2 × 15", "2 × 15", 45),
        gen("calf_raises", "2 × 20", "2 × 20", 30),
      ];
    case "intervals":
      return [
        gen("bodyweight_squats", "2 × 12", "2 × 12", 45),
        gen("plank", "2 × 30 sec", "2 × 30 сек", 45),
      ];
    case "mobility":
      return [
        gen("hip_circles", "2 × 10", "2 × 10", 0),
        gen("child_pose", "60 sec", "60 сек", 0),
      ];
    default:
      return [];
  }
}

export function selectAccessoryExercises(ctx: GeneratorContext): GeneratedExercise[] {
  const items: GeneratedExercise[] = [];

  if (ctx.dayType === "mobility" || ctx.dayType === "easy_run") {
    items.push(gen("dead_bug", "2 × 10", "2 × 10", 45));
    return items;
  }

  items.push(gen("plank", "3 × 30–45 sec", "3 × 30–45 сек", 45));
  items.push(gen("dead_bug", "3 × 10", "3 × 10", 45));

  if (ctx.dayType === "pull" && hasEquipment(ctx, "pull_up_bar")) {
    if (LEVEL_RANK[ctx.result.coreLevel] >= LEVEL_RANK.novice) {
      if (!hasLimitation(ctx, "back")) {
        items.push(gen("hanging_knee_raises", "3 × 8", "3 × 8", 60));
      }
    }
  }

  if (ctx.dayType === "legs") {
    items.push(gen("side_plank", "2 × 25 sec/side", "2 × 25 сек/сторона", 30));
  }

  return items.slice(0, 3);
}

export function selectConditioningExercises(
  ctx: GeneratorContext
): GeneratedExercise[] | undefined {
  if (ctx.dayType === "mobility") return undefined;

  const { cardioAccess, cardioPreference } = ctx.input;

  if (ctx.dayType === "easy_run") {
    if (!allowsRunningWorkouts(cardioAccess)) {
      return pickNoRunConditioning(ctx);
    }
    if (cardioPreference === "dislike") {
      return [
        gen("brisk_walk", "12 min", "12 мин", 0),
        gen("walk", "8 min", "8 мин", 0),
      ];
    }
    if (cardioAccess === "treadmill") {
      return [
        gen(
          "easy_run",
          "15–20 min treadmill, flat",
          "15–20 мин дорожка, ровно",
          0
        ),
      ];
    }
    return [gen("easy_run", "15–20 min", "15–20 мин", 0)];
  }

  if (ctx.dayType === "intervals") {
    if (!allowsRunningWorkouts(cardioAccess)) {
      return pickNoRunConditioning(ctx);
    }
    if (cardioPreference === "dislike") {
      return [
        gen("low_impact_conditioning", "4 rounds", "4 круга", 0),
        gen("brisk_walk", "6 min", "6 мин", 0),
      ];
    }
    if (isHighImpactBlocked(ctx)) {
      return [
        gen(
          "intervals",
          "6 × (1 min brisk / 2 min walk)",
          "6 × (1 мин быстрее / 2 мин ходьба)",
          0
        ),
      ];
    }
    if (cardioAccess === "treadmill") {
      return [
        gen(
          "intervals",
          "8 × (1 min brisk / 90 sec easy), flat treadmill",
          "8 × (1 мин быстрее / 90 сек легко), ровная дорожка",
          0
        ),
      ];
    }
    return [
      gen(
        "intervals",
        "8 × (1 min hard / 90 sec easy)",
        "8 × (1 мин быстрее / 90 сек легко)",
        0
      ),
    ];
  }

  if (ctx.dayType === "legs" || ctx.dayType === "pull") {
    return undefined;
  }

  if (isHighImpactBlocked(ctx)) {
    return [gen("walk", "10 min", "10 мин", 0)];
  }

  if (cardioPreference === "dislike") {
    return [
      gen("brisk_walk", "10 min", "10 мин", 0),
      gen("low_impact_conditioning", "3 rounds", "3 круга", 0),
    ];
  }

  if (ctx.input.goal === "fat_loss") {
    if (!allowsRunningWorkouts(cardioAccess)) {
      return pickNoRunConditioning(ctx);
    }
    return [gen("mountain_climbers", "4 × 30 sec", "4 × 30 сек", 60)];
  }

  return [gen("brisk_walk", "8 min", "8 мин", 0)];
}

const DAY_TITLES: Record<DayType, LocalizedText> = {
  full_body: { en: "Full body", ru: "Всё тело" },
  push: { en: "Push", ru: "Жим" },
  pull: { en: "Pull", ru: "Тяга" },
  legs: { en: "Legs", ru: "Ноги" },
  easy_run: { en: "Easy run", ru: "Лёгкий бег" },
  intervals: { en: "Intervals", ru: "Интервалы" },
  mobility: { en: "Mobility", ru: "Мобильность" },
};

const BLOCK_TITLES = {
  warmup: { en: "Warm-up", ru: "Разминка" },
  mainWork: { en: "Main work", ru: "Основная работа" },
  accessoryWork: { en: "Accessory", ru: "Дополнительно" },
  conditioning: { en: "Conditioning", ru: "Кондиция" },
  cooldown: { en: "Cool-down", ru: "Заминка" },
};

function estimateMinutes(workout: Omit<GeneratedWorkout, "estimatedMinutes">): number {
  let total = 0;
  const countRest = (items: GeneratedExercise[]) =>
    items.reduce((s, i) => s + i.restSeconds, 0);

  total += workout.blocks.warmup.items.length * 45;
  total += countRest(workout.blocks.mainWork.items);
  total += workout.blocks.mainWork.items.length * 90;
  total += countRest(workout.blocks.accessoryWork.items);
  total += workout.blocks.accessoryWork.items.length * 60;
  if (workout.blocks.conditioning) {
    total += workout.blocks.conditioning.items.length * 120;
  }
  total += workout.blocks.cooldown.items.length * 40;
  return Math.round(total / 60);
}

export function generateWorkout(
  input: AssessmentInput,
  result: AssessmentResult,
  dayType: DayType,
  pathMode: PathMode = "balance"
): GeneratedWorkout {
  const ctx: GeneratorContext = { input, result, dayType, pathMode };

  const warmupItems = selectWarmupExercises(ctx);
  const mainItems = selectMainExercises(ctx);
  const accessoryItems = selectAccessoryExercises(ctx);
  const conditioningItems = selectConditioningExercises(ctx);
  const cooldownItems = selectCooldownExercises(ctx);

  const raw: Omit<GeneratedWorkout, "estimatedMinutes"> = {
    id: `${input.goal}_${result.overallLevel}_${dayType}_${pathMode}`,
    title: DAY_TITLES[dayType],
    goal: input.goal,
    level: result.overallLevel,
    dayType,
    blocks: {
      warmup: { title: BLOCK_TITLES.warmup, items: warmupItems },
      mainWork: { title: BLOCK_TITLES.mainWork, items: mainItems },
      accessoryWork: {
        title: BLOCK_TITLES.accessoryWork,
        items: accessoryItems,
      },
      conditioning: conditioningItems
        ? { title: BLOCK_TITLES.conditioning, items: conditioningItems }
        : undefined,
      cooldown: { title: BLOCK_TITLES.cooldown, items: cooldownItems },
    },
  };

  const base = trimWorkoutForPathMode(raw, pathMode);
  return { ...base, estimatedMinutes: estimateMinutes(base) };
}

function isTrainingDayType(dayType: DayType): boolean {
  return dayType !== "mobility";
}

function countTrainingDays(days: DayType[]): number {
  return days.filter(isTrainingDayType).length;
}

function capTrainingDays(days: DayType[], maxTraining: number): DayType[] {
  const result = [...days];
  let count = countTrainingDays(result);
  for (let i = result.length - 1; i >= 0 && count > maxTraining; i--) {
    if (isTrainingDayType(result[i])) {
      result[i] = "mobility";
      count--;
    }
  }
  return result;
}

function boostTrainingDays(days: DayType[], targetMin: number): DayType[] {
  const result = [...days];
  let count = countTrainingDays(result);
  for (let i = 0; i < result.length && count < targetMin; i++) {
    if (result[i] === "mobility") {
      result[i] = "full_body";
      count++;
    }
  }
  return result;
}

/** Adjust weekly slots from path mode (sport / self_development / balance). */
export function applyPathModeWeekTemplate(
  template: DayType[],
  pathMode: PathMode,
  level: FitnessLevel
): DayType[] {
  const isBeginner = LEVEL_RANK[level] <= LEVEL_RANK.beginner;
  let days = [...template];

  if (pathMode === "sport") {
    return boostTrainingDays(days, isBeginner ? 4 : 5);
  }

  if (pathMode === "self_development") {
    return capTrainingDays(days, isBeginner ? 2 : 3);
  }

  days = capTrainingDays(days, isBeginner ? 4 : 5);
  return boostTrainingDays(days, isBeginner ? 3 : 4);
}

function trimWorkoutForPathMode(
  workout: Omit<GeneratedWorkout, "estimatedMinutes">,
  pathMode: PathMode
): Omit<GeneratedWorkout, "estimatedMinutes"> {
  if (pathMode !== "self_development") return workout;

  return {
    ...workout,
    blocks: {
      ...workout.blocks,
      mainWork: {
        ...workout.blocks.mainWork,
        items: workout.blocks.mainWork.items.slice(0, 2),
      },
      accessoryWork: {
        ...workout.blocks.accessoryWork,
        items: workout.blocks.accessoryWork.items.slice(0, 1),
      },
      conditioning:
        workout.blocks.conditioning &&
        workout.dayType !== "mobility" &&
        workout.dayType !== "easy_run"
          ? {
              ...workout.blocks.conditioning,
              items: workout.blocks.conditioning.items.slice(0, 1),
            }
          : workout.blocks.conditioning,
    },
  };
}

function weekTemplate(goal: FitnessGoal, level: FitnessLevel): DayType[] {
  const L = LEVEL_RANK[level];

  if (goal === "mass_gain") {
    if (L <= LEVEL_RANK.beginner) {
      return ["full_body", "mobility", "full_body", "easy_run", "full_body", "mobility", "full_body"];
    }
    if (L === LEVEL_RANK.novice || L === LEVEL_RANK.intermediate) {
      return ["push", "pull", "legs", "mobility", "full_body", "easy_run", "mobility"];
    }
    return ["push", "pull", "legs", "push", "pull", "easy_run", "mobility"];
  }

  if (goal === "fat_loss") {
    return [
      "full_body",
      "easy_run",
      "full_body",
      "intervals",
      "mobility",
      "full_body",
      "easy_run",
    ];
  }

  if (goal === "runner") {
    return ["easy_run", "mobility", "full_body", "easy_run", "intervals", "full_body", "mobility"];
  }

  // athletic
  if (L <= LEVEL_RANK.beginner) {
    return ["full_body", "easy_run", "full_body", "intervals", "mobility", "full_body", "mobility"];
  }
  return ["pull", "push", "legs", "full_body", "intervals", "easy_run", "mobility"];
}

export function generateWeekPlan(
  input: AssessmentInput,
  result: AssessmentResult,
  pathMode: PathMode = "balance"
): WeekPlan {
  const baseWeek = weekTemplate(input.goal, result.overallLevel);
  const withPath = applyPathModeWeekTemplate(
    baseWeek,
    pathMode,
    result.overallLevel
  );
  const types = applyCardioWeekTemplate(withPath, input);

  const days: WeekDaySlot[] = types.map((dayType, dayIndex) => ({
    dayIndex,
    dayType,
    workout: generateWorkout(input, result, dayType, pathMode),
  }));

  return {
    goal: input.goal,
    level: result.overallLevel,
    days,
  };
}

// --- Examples ---

export const exampleTallLeanIntermediateInput: AssessmentInput = {
  age: 21,
  height: 198,
  weight: 85,
  goal: "athletic",
  maxPullUps: 12,
  maxPushUps: 45,
  squatReps2Min: 70,
  plankSeconds: 120,
  run1kmSeconds: 330,
  equipment: ["pull_up_bar", "backpack"],
  limitations: ["none"],
  cardioAccess: "outdoor",
  cardioPreference: "enjoy",
};

export const exampleTallLeanIntermediateResult: AssessmentResult = assessFitness(
  exampleTallLeanIntermediateInput
);

export const exampleHeavyBeginnerInput: AssessmentInput = {
  age: 35,
  height: 175,
  weight: 110,
  goal: "fat_loss",
  maxPullUps: 0,
  maxPushUps: 8,
  squatReps2Min: 20,
  plankSeconds: 25,
  walkRun12MinMeters: 1200,
  equipment: ["none"],
  limitations: ["overweight", "knees"],
  cardioAccess: "none",
  cardioPreference: "dislike",
};

export const exampleHeavyBeginnerResult: AssessmentResult = assessFitness(
  exampleHeavyBeginnerInput
);

export const exampleTallLeanIntermediateWeekPlan = generateWeekPlan(
  exampleTallLeanIntermediateInput,
  exampleTallLeanIntermediateResult
);

export const exampleHeavyBeginnerWeekPlan = generateWeekPlan(
  exampleHeavyBeginnerInput,
  exampleHeavyBeginnerResult
);

export const exampleTallLeanIntermediatePullWorkout = generateWorkout(
  exampleTallLeanIntermediateInput,
  exampleTallLeanIntermediateResult,
  "pull"
);

export const exampleHeavyBeginnerFullBodyWorkout = generateWorkout(
  exampleHeavyBeginnerInput,
  exampleHeavyBeginnerResult,
  "full_body"
);
