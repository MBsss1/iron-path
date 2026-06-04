import {
  getExercise,
  type Exercise,
  type ExerciseCategory,
  type LocalizedLines,
  type LocalizedText,
} from "./exercises";

export type ExerciseInfo = {
  id: string;
  name: LocalizedText;
  category: ExerciseCategory;
  description: LocalizedText;
  instructions: LocalizedLines;
  mistakes: LocalizedLines;
  easierVariant: LocalizedText | null;
  harderVariant: LocalizedText | null;
  muscles: string[];
};

const DESCRIPTIONS: Record<string, LocalizedText> = {
  pullups: {
    en: "Builds vertical pulling strength for your back, arms, and grip — the foundation for a strong upper body.",
    ru: "Развивает вертикальную тягу: спина, руки, хват — база сильного верха тела.",
  },
  negative_pullups: {
    en: "Teaches control on the way down so you can progress safely toward full pull-ups.",
    ru: "Учит контролю на опускании — безопасный шаг к полным подтягиваниям.",
  },
  australian_rows: {
    en: "Horizontal pulling for posture and back thickness without needing a full pull-up yet.",
    ru: "Горизонтальная тяга для осанки и спины, когда полных подтягиваний ещё нет.",
  },
  scapular_pullups: {
    en: "Activates shoulder blades and lats — essential prep before heavy pulling volume.",
    ru: "Включает лопатки и широчайшие — подготовка перед объёмом тяги.",
  },
  pushups: {
    en: "Classic pushing pattern for chest, shoulders, and triceps with no equipment.",
    ru: "Базовый жим для груди, плеч и трицепса без оборудования.",
  },
  incline_pushups: {
    en: "Reduces load on the arms so you can build push strength with clean technique.",
    ru: "Снижает нагрузку на руки — наращиваешь жим с чистой техникой.",
  },
  wall_pushups: {
    en: "Gentle entry to pushing — good when returning after a break or building from zero.",
    ru: "Мягкий вход в жим — после перерыва или с нуля.",
  },
  bodyweight_squats: {
    en: "Trains legs and glutes for daily movement, running, and overall leg strength.",
    ru: "Ноги и ягодицы для движения, бега и общей силы ног.",
  },
  chair_squats: {
    en: "Safe squat pattern with a depth limit — ideal for knees or coming back to training.",
    ru: "Безопасный присед с ограничением глубины — для коленей или возврата в форму.",
  },
  plank: {
    en: "Teaches full-body tension and core endurance that protects your spine under load.",
    ru: "Напряжение всего тела и выносливость корпуса — защита позвоночника под нагрузкой.",
  },
  dead_bug: {
    en: "Trains core stability while keeping the lower back safe — base for harder ab work.",
    ru: "Стабильность корпуса без прогиба поясницы — база перед сложным кором.",
  },
  walk: {
    en: "Low-impact cardio that builds aerobic base and recovery without joint stress.",
    ru: "Щадящее кардио и аэробная база без лишней нагрузки на суставы.",
  },
  easy_run: {
    en: "Easy-paced running to improve endurance — stay conversational, not gasping.",
    ru: "Бег в лёгком темпе для выносливости — темп разговора, не задыхаться.",
  },
};

export const EXERCISE_LIBRARY_IDS = [
  "pullups",
  "negative_pullups",
  "australian_rows",
  "scapular_pullups",
  "pushups",
  "incline_pushups",
  "wall_pushups",
  "bodyweight_squats",
  "chair_squats",
  "plank",
  "dead_bug",
  "walk",
  "easy_run",
] as const;

export type ExerciseLibraryId = (typeof EXERCISE_LIBRARY_IDS)[number];

function variantLabel(exerciseId: string | undefined): LocalizedText | null {
  if (!exerciseId) return null;
  const ex = getExercise(exerciseId);
  return ex?.name ?? null;
}

function toExerciseInfo(exercise: Exercise): ExerciseInfo {
  const description =
    DESCRIPTIONS[exercise.id] ?? {
      en: `Training focus: ${exercise.category}.`,
      ru: `Фокус: ${exercise.category}.`,
    };

  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    description,
    instructions: exercise.instructions,
    mistakes: exercise.commonMistakes,
    easierVariant: variantLabel(exercise.regressions[0]),
    harderVariant: variantLabel(exercise.progressions[0]),
    muscles: [...exercise.muscles],
  };
}

const LIBRARY: Record<string, ExerciseInfo> = {};

for (const id of EXERCISE_LIBRARY_IDS) {
  const exercise = getExercise(id);
  if (exercise) {
    LIBRARY[id] = toExerciseInfo(exercise);
  }
}

export function getExerciseInfo(id: string): ExerciseInfo | undefined {
  return LIBRARY[id];
}

export function hasExerciseInfo(id: string): boolean {
  return id in LIBRARY;
}

export function getAllExerciseLibraryEntries(): ExerciseInfo[] {
  return EXERCISE_LIBRARY_IDS.map((id) => LIBRARY[id]).filter(Boolean);
}
