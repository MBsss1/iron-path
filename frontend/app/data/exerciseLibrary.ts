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
  imageUrl?: string;
  imageKey?: string;
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

  scapular_pulls: {

    en: "Light scapular activation in warm-up — prepares shoulders before pulling work.",

    ru: "Лёгкая активация лопаток в разминке — подготовка плеч к тяге.",

  },

  dead_hang: {

    en: "Builds grip and shoulder stability — foundation before pull-up progressions.",

    ru: "Хват и стабильность плеч — база перед прогрессией подтягиваний.",

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

  knee_pushups: {

    en: "Moderate push-up regression — less load than full push-ups while training the pattern.",

    ru: "Умеренная регрессия отжиманий — меньше нагрузки, чем в полных.",

  },

  decline_pushups: {

    en: "Increases pushing load by elevating feet — more chest and shoulder demand.",

    ru: "Больше нагрузки на жим за счёт высоты ног — грудь и плечи работают сильнее.",

  },

  dips: {

    en: "Strong vertical push for chest and triceps — needs stable shoulders and bars.",

    ru: "Сильный вертикальный жим на грудь и трицепс — нужны стабильные плечи и брусья.",

  },

  bodyweight_squats: {

    en: "Trains legs and glutes for daily movement, running, and overall leg strength.",

    ru: "Ноги и ягодицы для движения, бега и общей силы ног.",

  },

  chair_squats: {

    en: "Safe squat pattern with a depth limit — ideal for knees or coming back to training.",

    ru: "Безопасный присед с ограничением глубины — для коленей или возврата в форму.",

  },

  lunges: {

    en: "Single-leg strength and balance — builds legs with controlled step pattern.",

    ru: "Сила и баланс на одной ноге — ноги через контролируемые выпады.",

  },

  split_squats: {

    en: "Split stance squat for leg strength with less spinal load than heavy bar work.",

    ru: "Присед в выпаде — сила ног с меньшей нагрузкой на спину.",

  },

  step_ups: {

    en: "Low-impact leg work using a stable step — good for knees and beginners.",

    ru: "Щадящая работа ног на ступеньке — подходит для коленей и новичков.",

  },

  calf_raises: {

    en: "Strengthens calves and ankles — helps running and daily stability.",

    ru: "Укрепляет икры и голеностоп — помогает бегу и устойчивости.",

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

  brisk_walk: {

    en: "Faster walking pace to raise heart rate without jumping or heavy impact.",

    ru: "Быстрая ходьба для пульса без прыжков и ударной нагрузки.",

  },

  easy_run: {

    en: "Easy-paced running to improve endurance — stay conversational, not gasping.",

    ru: "Бег в лёгком темпе для выносливости — темп разговора, не задыхаться.",

  },

  intervals: {

    en: "Short harder efforts with easy recovery — builds cardio without long steady runs.",

    ru: "Короткие усилия с лёгким восстановлением — кардио без длинного ровного бега.",

  },

  jumping_jacks: {

    en: "Light full-body warm-up to raise heart rate — skip if knees or joints are sensitive.",

    ru: "Лёгкая разминка всего тела — пропусти при чувствительных коленях/суставах.",

  },

  mountain_climbers: {

    en: "Dynamic core and cardio drill — keep hips low and control the pace.",

    ru: "Динамика на кор и кардио — таз ниже, темп под контролем.",

  },

  child_pose: {

    en: "Relaxation stretch for back and hips after training.",

    ru: "Расслабляющая растяжка спины и бёдер после тренировки.",

  },

  hamstring_stretch: {

    en: "Stretches back of the thigh — eases tension from squats and running.",

    ru: "Растяжка задней поверхности бедра — снимает напряжение после приседов и бега.",

  },

  quad_stretch: {

    en: "Front-of-thigh stretch — helps recovery after leg work.",

    ru: "Растяжка передней поверхности бедра — восстановление после ног.",

  },

  chest_stretch: {

    en: "Opens chest and shoulders after pushing work.",

    ru: "Раскрывает грудь и плечи после жима.",

  },

  lat_stretch: {

    en: "Side stretch for lats and trunk — useful after pulling days.",

    ru: "Боковая растяжка широчайших и корпуса — после тяги.",

  },

  calf_stretch: {

    en: "Calf stretch for ankles and lower legs — especially after runs.",

    ru: "Растяжка икр и голеностопа — особенно после бега.",

  },

};



/** Curated entries; any exercise in exercises.ts resolves via fallback in getExerciseInfo. */

export const EXERCISE_LIBRARY_IDS = [

  "pullups",

  "negative_pullups",

  "australian_rows",

  "scapular_pullups",

  "scapular_pulls",

  "dead_hang",

  "pushups",

  "incline_pushups",

  "wall_pushups",

  "knee_pushups",

  "decline_pushups",

  "dips",

  "bodyweight_squats",

  "chair_squats",

  "lunges",

  "split_squats",

  "step_ups",

  "calf_raises",

  "plank",

  "dead_bug",

  "walk",

  "brisk_walk",

  "easy_run",

  "intervals",

  "jumping_jacks",

  "mountain_climbers",

  "child_pose",

  "hamstring_stretch",

  "quad_stretch",

  "chest_stretch",

  "lat_stretch",

  "calf_stretch",

] as const;



export type ExerciseLibraryId = (typeof EXERCISE_LIBRARY_IDS)[number];



function variantLabel(exerciseId: string | undefined): LocalizedText | null {

  if (!exerciseId) return null;

  const ex = getExercise(exerciseId);

  return ex?.name ?? null;

}



const CATEGORY_DESCRIPTION_FALLBACK: Record<ExerciseCategory, LocalizedText> = {
  warmup: {
    en: "Prepares your body for training so you can move safely.",
    ru: "Упражнение помогает подготовить тело к нагрузке и выполнить тренировку безопаснее.",
  },
  pull: {
    en: "Builds pulling strength for your back and arms.",
    ru: "Развивает силу тяги для спины и рук.",
  },
  push: {
    en: "Builds pushing strength for chest, shoulders, and triceps.",
    ru: "Развивает силу жима для груди, плеч и трицепсов.",
  },
  legs: {
    en: "Strengthens legs and supports stable movement patterns.",
    ru: "Укрепляет ноги и поддерживает устойчивые паттерны движения.",
  },
  core: {
    en: "Strengthens the core for stability during lifts and runs.",
    ru: "Укрепляет корпус для стабильности в силовых и беге.",
  },
  cardio: {
    en: "Improves endurance and cardiovascular capacity.",
    ru: "Развивает выносливость и сердечно-сосудистую форму.",
  },
  mobility: {
    en: "Improves joint range of motion and movement quality.",
    ru: "Улучшает подвижность суставов и качество движений.",
  },
  cooldown: {
    en: "Helps your body recover after training.",
    ru: "Помогает телу восстановиться после нагрузки.",
  },
};

function descriptionForExercise(exercise: Exercise): LocalizedText {
  if (DESCRIPTIONS[exercise.id]) {
    return DESCRIPTIONS[exercise.id];
  }
  return (
    CATEGORY_DESCRIPTION_FALLBACK[exercise.category] ??
    CATEGORY_DESCRIPTION_FALLBACK.warmup
  );
}

function toExerciseInfo(exercise: Exercise): ExerciseInfo {
  const description = descriptionForExercise(exercise);



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
    imageUrl: exercise.imageUrl,
    imageKey: exercise.imageKey,
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

  if (LIBRARY[id]) return LIBRARY[id];

  const exercise = getExercise(id);

  if (!exercise) return undefined;

  return toExerciseInfo(exercise);

}



export function hasExerciseInfo(id: string): boolean {

  return getExerciseInfo(id) !== undefined;

}



export function getAllExerciseLibraryEntries(): ExerciseInfo[] {

  return EXERCISE_LIBRARY_IDS.map((id) => LIBRARY[id]).filter(Boolean);

}


