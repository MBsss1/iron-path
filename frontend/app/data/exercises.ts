export type ExerciseLevel =
  | "absolute_beginner"
  | "beginner"
  | "novice"
  | "intermediate"
  | "advanced";

export type Equipment =
  | "none"
  | "pull_up_bar"
  | "parallel_bars"
  | "backpack"
  | "resistance_band";

export type ExerciseCategory =
  | "warmup"
  | "pull"
  | "push"
  | "legs"
  | "core"
  | "cardio"
  | "mobility"
  | "cooldown";

export type LocalizedLines = { en: string[]; ru: string[] };
export type LocalizedText = { en: string; ru: string };

export type Exercise = {
  id: string;
  category: ExerciseCategory;
  level: ExerciseLevel;
  equipment: Equipment[];
  muscles: string[];
  name: LocalizedText;
  instructions: LocalizedLines;
  commonMistakes: LocalizedLines;
  regressions: string[];
  progressions: string[];
  contraindications?: string[];
  imageUrl?: string;
  imageKey?: string;
  videoUrl?: string;
};

type ExerciseInput = Omit<Exercise, "equipment" | "regressions" | "progressions"> &
  Partial<Pick<Exercise, "equipment" | "regressions" | "progressions">>;

function ex(partial: ExerciseInput): Exercise {
  return {
    ...partial,
    equipment: partial.equipment ?? ["none"],
    regressions: partial.regressions ?? [],
    progressions: partial.progressions ?? [],
  };
}

export const EXERCISES: Exercise[] = [
  // Warmup
  ex({
    id: "arm_circles",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["shoulders"],
    name: { en: "Arm circles", ru: "Круги руками" },
    instructions: {
      en: [
        "Stand tall, arms extended to the sides.",
        "Make small circles, gradually larger.",
        "Reverse direction after 10 reps.",
      ],
      ru: [
        "Стоя ровно, руки в стороны.",
        "Маленькие круги, постепенно больше.",
        "Смени направление через 10 повторов.",
      ],
    },
    commonMistakes: {
      en: ["Shrugging shoulders", "Moving too fast"],
      ru: ["Поднимают плечи", "Слишком быстро"],
    },
    progressions: ["shoulder_rolls"],
  }),
  ex({
    id: "shoulder_rolls",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["shoulders"],
    name: { en: "Shoulder rolls", ru: "Вращения плечами" },
    instructions: {
      en: [
        "Roll shoulders forward 8 times.",
        "Roll backward 8 times.",
        "Keep neck relaxed.",
      ],
      ru: [
        "Катай плечи вперёд 8 раз.",
        "Назад 8 раз.",
        "Шея расслаблена.",
      ],
    },
    commonMistakes: {
      en: ["Tensing the neck", "Only moving one side"],
      ru: ["Зажимают шею", "Двигают только одну сторону"],
    },
    regressions: ["arm_circles"],
  }),
  ex({
    id: "hip_circles",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["hips", "core"],
    name: { en: "Hip circles", ru: "Круги бёдрами" },
    instructions: {
      en: [
        "Hands on hips, feet shoulder-width.",
        "Draw circles with hips, 8 each way.",
        "Keep knees soft.",
      ],
      ru: [
        "Руки на бёдрах, стопы на ширине плеч.",
        "Круги бёдрами, по 8 в каждую сторону.",
        "Колени мягкие.",
      ],
    },
    commonMistakes: {
      en: ["Locked knees", "Excessive lean"],
      ru: ["Колени заблокированы", "Сильный наклон корпуса"],
    },
  }),
  ex({
    id: "jumping_jacks",
    category: "warmup",
    level: "beginner",
    muscles: ["full body"],
    name: { en: "Jumping jacks", ru: "Прыжки с разведением" },
    instructions: {
      en: [
        "Start feet together, arms at sides.",
        "Jump feet out while raising arms overhead.",
        "Land softly, repeat at steady pace.",
      ],
      ru: [
        "Старт: стопы вместе, руки по швам.",
        "Прыжок: ноги в стороны, руки вверх.",
        "Мягкое приземление, ровный темп.",
      ],
    },
    commonMistakes: {
      en: ["Heavy landing", "Holding breath"],
      ru: ["Жёсткое приземление", "Задержка дыхания"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["brisk_walk"],
    progressions: ["mountain_climbers"],
  }),
  ex({
    id: "light_jog",
    category: "warmup",
    level: "beginner",
    muscles: ["legs", "cardio"],
    name: { en: "Light jog", ru: "Лёгкий бег" },
    instructions: {
      en: [
        "Jog at conversational pace.",
        "Short strides, mid-foot landing.",
        "2–5 minutes to raise pulse.",
      ],
      ru: [
        "Бег в темпе разговора.",
        "Короткий шаг, середина стопы.",
        "2–5 минут для пульса.",
      ],
    },
    commonMistakes: {
      en: ["Sprinting too early", "Heel striking hard"],
      ru: ["Слишком быстрый старт", "Удар пяткой"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["brisk_walk"],
  }),
  ex({
    id: "brisk_walk",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["legs", "cardio"],
    name: { en: "Brisk walk", ru: "Быстрая ходьба" },
    instructions: {
      en: [
        "Walk with upright posture.",
        "Pump arms naturally.",
        "3–5 minutes, breathe through nose if possible.",
      ],
      ru: [
        "Ходьба с ровной осанкой.",
        "Руки работают естественно.",
        "3–5 минут, дыши ровно.",
      ],
    },
    commonMistakes: {
      en: ["Slouching", "Overstriding"],
      ru: ["Сутулятся", "Слишком длинный шаг"],
    },
    progressions: ["light_jog", "walk"],
  }),
  ex({
    id: "scapular_pulls",
    category: "warmup",
    level: "beginner",
    equipment: ["pull_up_bar"],
    muscles: ["back", "shoulders"],
    name: { en: "Scapular pulls", ru: "Лопаточные подтягивания" },
    instructions: {
      en: [
        "Hang from bar, arms straight.",
        "Pull shoulder blades down and together.",
        "Release with control, 8–12 reps.",
      ],
      ru: [
        "Вис на турнике, руки прямые.",
        "Опускай и своди лопатки.",
        "Возврат с контролем, 8–12 раз.",
      ],
    },
    commonMistakes: {
      en: ["Bending elbows too much", "Shrugging up"],
      ru: ["Сгибают локти", "Поднимают плечи вверх"],
    },
    regressions: ["dead_hang"],
    progressions: ["scapular_pullups"],
  }),
  ex({
    id: "incline_pushup_warmup",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["chest", "shoulders"],
    name: { en: "Incline push-up (warm-up)", ru: "Отжимания на наклоне (разминка)" },
    instructions: {
      en: [
        "Hands on bench or wall, body straight.",
        "Lower chest toward surface.",
        "2 sets of 8–10 easy reps.",
      ],
      ru: [
        "Руки на опоре, тело прямое.",
        "Опускай грудь к опоре.",
        "2 подхода по 8–10 лёгких повторов.",
      ],
    },
    commonMistakes: {
      en: ["Sagging hips", "Flaring elbows wide"],
      ru: ["Провисает таз", "Локти слишком в стороны"],
    },
    progressions: ["incline_pushups", "pushups"],
  }),
  ex({
    id: "elbow_rotations",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["arms"],
    name: { en: "Elbow rotations", ru: "Вращения локтями" },
    instructions: {
      en: [
        "Arms bent 90°, elbows at sides.",
        "Rotate forearms in small circles.",
        "10 each direction, keep shoulders still.",
      ],
      ru: [
        "Руки согнуты 90°, локти у корпуса.",
        "Вращай предплечья небольшими кругами.",
        "10 в каждую сторону, плечи неподвижны.",
      ],
    },
    commonMistakes: {
      en: ["Moving shoulders", "Circles too large"],
      ru: ["Двигают плечи", "Слишком широкие круги"],
    },
    regressions: ["arm_circles"],
  }),
  ex({
    id: "wrist_rotations",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["forearms"],
    name: { en: "Wrist rotations", ru: "Вращения запястьями" },
    instructions: {
      en: [
        "Extend arms forward, palms down.",
        "Circle wrists slowly both ways.",
        "10 reps each direction.",
      ],
      ru: [
        "Руки вперёд, ладони вниз.",
        "Медленно вращай запястья в обе стороны.",
        "10 раз в каждую сторону.",
      ],
    },
    commonMistakes: {
      en: ["Rushing", "Bending elbows"],
      ru: ["Торопятся", "Сгибают локти"],
    },
  }),
  ex({
    id: "wall_slides",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["shoulders", "upper back"],
    name: { en: "Wall slides", ru: "Скольжение по стене" },
    instructions: {
      en: [
        "Back flat to wall, arms in W shape.",
        "Slide arms up overhead without losing contact.",
        "10 slow reps.",
      ],
      ru: [
        "Спина к стене, руки в форме W.",
        "Скользи руками вверх, не отрывая от стены.",
        "10 медленных повторов.",
      ],
    },
    commonMistakes: {
      en: ["Arching lower back", "Ribs flaring"],
      ru: ["Прогиб поясницы", "Рёбра выходят вперёд"],
    },
    contraindications: ["shoulders"],
    regressions: ["shoulder_rolls"],
  }),
  ex({
    id: "leg_swings",
    category: "warmup",
    level: "beginner",
    muscles: ["hips", "legs"],
    name: { en: "Leg swings", ru: "Махи ногой" },
    instructions: {
      en: [
        "Hold wall for balance.",
        "Swing one leg forward and back smoothly.",
        "10 each leg, controlled range.",
      ],
      ru: [
        "Держись за стену для баланса.",
        "Махи одной ногой вперёд-назад плавно.",
        "10 на каждую ногу, контролируемая амплитуда.",
      ],
    },
    commonMistakes: {
      en: ["Swinging too hard", "Leaning torso"],
      ru: ["Слишком резкие махи", "Наклон корпуса"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["hip_circles"],
  }),
  ex({
    id: "ankle_rotations",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["calves", "ankles"],
    name: { en: "Ankle rotations", ru: "Вращения голеностопом" },
    instructions: {
      en: [
        "Stand on one foot or hold support.",
        "Circle ankle slowly both ways.",
        "10 each foot.",
      ],
      ru: [
        "Стоя на одной ноге или с опорой.",
        "Медленно вращай голеностоп в обе стороны.",
        "10 на каждую стопу.",
      ],
    },
    commonMistakes: {
      en: ["Moving too fast", "Unstable balance"],
      ru: ["Слишком быстро", "Нет устойчивости"],
    },
  }),
  ex({
    id: "knee_rotations",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["legs"],
    name: { en: "Knee rotations", ru: "Вращения коленями" },
    instructions: {
      en: [
        "Feet together, hands on knees.",
        "Draw small circles with knees.",
        "8 each direction.",
      ],
      ru: [
        "Стопы вместе, руки на коленях.",
        "Небольшие круги коленями.",
        "8 в каждую сторону.",
      ],
    },
    commonMistakes: {
      en: ["Circles too large", "Locked hips"],
      ru: ["Слишком широкие круги", "Заблокирован таз"],
    },
    contraindications: ["knees"],
    regressions: ["ankle_rotations"],
  }),
  ex({
    id: "bird_dog",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["core", "back"],
    name: { en: "Bird dog", ru: "Собака-птица" },
    instructions: {
      en: [
        "On all fours, spine neutral.",
        "Extend opposite arm and leg.",
        "Hold 2 sec, 8 each side.",
      ],
      ru: [
        "На четвереньках, спина нейтральна.",
        "Вытягивай противоположные руку и ногу.",
        "Пауза 2 сек, 8 на сторону.",
      ],
    },
    commonMistakes: {
      en: ["Rotating hips", "Arching back"],
      ru: ["Поворот таза", "Прогиб спины"],
    },
    progressions: ["dead_bug_light"],
  }),
  ex({
    id: "dead_bug_light",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["core"],
    name: { en: "Dead bug (light)", ru: "Мёртвый жук (лёгкий)" },
    instructions: {
      en: [
        "On back, knees bent, arms up.",
        "Tap heel to floor one leg at a time.",
        "Slow, 8 each side, back flat.",
      ],
      ru: [
        "На спине, колени согнуты, руки вверх.",
        "Касайся пола пяткой по одной ноге.",
        "Медленно, 8 на сторону, поясница прижата.",
      ],
    },
    commonMistakes: {
      en: ["Arching lower back", "Moving too fast"],
      ru: ["Прогиб поясницы", "Слишком быстро"],
    },
    regressions: ["bird_dog"],
    progressions: ["dead_bug"],
  }),
  ex({
    id: "marching",
    category: "warmup",
    level: "absolute_beginner",
    muscles: ["legs", "core"],
    name: { en: "Marching in place", ru: "Ходьба на месте" },
    instructions: {
      en: [
        "Stand tall, march knees up gently.",
        "Pump arms naturally.",
        "60 seconds at easy pace.",
      ],
      ru: [
        "Стоя ровно, поднимай колени мягко.",
        "Руки работают естественно.",
        "60 секунд в лёгком темпе.",
      ],
    },
    commonMistakes: {
      en: ["Leaning back", "Stomping feet"],
      ru: ["Откидываются назад", "Топают ногами"],
    },
    regressions: ["brisk_walk"],
    progressions: ["light_jog"],
  }),

  // Pull
  ex({
    id: "dead_hang",
    category: "pull",
    level: "absolute_beginner",
    equipment: ["pull_up_bar"],
    muscles: ["back", "forearms"],
    name: { en: "Dead hang", ru: "Вис на перекладине" },
    instructions: {
      en: [
        "Grip bar shoulder-width, palms away.",
        "Hang with shoulders engaged slightly down.",
        "Hold 15–40 seconds, breathe steadily.",
      ],
      ru: [
        "Хват на ширине плеч, ладони от себя.",
        "Вис, плечи чуть вниз от ушей.",
        "Держи 15–40 сек, дыши ровно.",
      ],
    },
    commonMistakes: {
      en: ["Fully relaxing shoulders", "Swinging legs"],
      ru: ["Полностью расслабляют плечи", "Качают ногами"],
    },
    progressions: ["scapular_pullups", "australian_rows"],
  }),
  ex({
    id: "scapular_pullups",
    category: "pull",
    level: "beginner",
    equipment: ["pull_up_bar"],
    muscles: ["back"],
    name: { en: "Scapular pull-ups", ru: "Лопаточные подтягивания" },
    instructions: {
      en: [
        "Hang with straight arms.",
        "Depress and retract scapula without bending elbows much.",
        "8–12 controlled reps.",
      ],
      ru: [
        "Вис на прямых руках.",
        "Опускай и своди лопатки, локти почти прямые.",
        "8–12 контролируемых повторов.",
      ],
    },
    commonMistakes: {
      en: ["Using legs to kip", "Shrugging upward"],
      ru: ["Читинг ногами", "Поднимают плечи"],
    },
    regressions: ["dead_hang", "scapular_pulls"],
    progressions: ["assisted_pullups", "australian_rows"],
  }),
  ex({
    id: "negative_pullups",
    category: "pull",
    level: "beginner",
    equipment: ["pull_up_bar"],
    muscles: ["back", "biceps"],
    name: { en: "Negative pull-ups", ru: "Негативные подтягивания" },
    instructions: {
      en: [
        "Jump or step to top position, chin over bar.",
        "Lower slowly for 3–5 seconds.",
        "3–5 reps, full control.",
      ],
      ru: [
        "Подъём в верх, подбородок над перекладиной.",
        "Медленное опускание 3–5 сек.",
        "3–5 повторов с контролем.",
      ],
    },
    commonMistakes: {
      en: ["Dropping fast", "Incomplete range"],
      ru: ["Падают быстро", "Короткая амплитуда"],
    },
    regressions: ["scapular_pullups"],
    progressions: ["assisted_pullups", "pullups"],
  }),
  ex({
    id: "assisted_pullups",
    category: "pull",
    level: "novice",
    equipment: ["pull_up_bar", "resistance_band"],
    muscles: ["back", "biceps"],
    name: { en: "Assisted pull-ups", ru: "Подтягивания с резиной" },
    instructions: {
      en: [
        "Band under foot or knee, grip bar.",
        "Pull chin over bar, elbows to ribs.",
        "Lower with control, 6–10 reps.",
      ],
      ru: [
        "Резина под стопой или коленом, хват на турнике.",
        "Подтяни подбородок выше перекладины.",
        "Опускайся с контролем, 6–10 раз.",
      ],
    },
    commonMistakes: {
      en: ["Kipping excessively", "Half reps"],
      ru: ["Сильный читинг", "Неполная амплитуда"],
    },
    regressions: ["negative_pullups", "australian_rows"],
    progressions: ["pullups"],
  }),
  ex({
    id: "australian_rows",
    category: "pull",
    level: "beginner",
    equipment: ["none"],
    muscles: ["back", "biceps"],
    name: { en: "Australian rows", ru: "Австралийские подтягивания" },
    instructions: {
      en: [
        "Under a bar or table, body straight.",
        "Pull chest to bar, squeeze shoulder blades.",
        "3 sets of 8–12.",
      ],
      ru: [
        "Под перекладиной или столом, тело прямое.",
        "Тяни грудь к опоре, своди лопатки.",
        "3 подхода по 8–12.",
      ],
    },
    commonMistakes: {
      en: ["Hips sagging", "Partial range"],
      ru: ["Провисает таз", "Короткий ход"],
    },
    regressions: ["scapular_pullups"],
    progressions: ["pullups", "backpack_rows"],
  }),
  ex({
    id: "pullups",
    category: "pull",
    level: "novice",
    equipment: ["pull_up_bar"],
    muscles: ["back", "biceps"],
    name: { en: "Pull-ups", ru: "Подтягивания" },
    instructions: {
      en: [
        "Hang, engage lats, pull chin over bar.",
        "Pause briefly at top.",
        "Lower to full hang, 4–10 reps.",
      ],
      ru: [
        "Вис, включи широчайшие, подбородок выше перекладины.",
        "Короткая пауза вверху.",
        "Полное опускание, 4–10 раз.",
      ],
    },
    commonMistakes: {
      en: ["Kipping", "Half range of motion"],
      ru: ["Читинг", "Неполная амплитуда"],
    },
    regressions: ["assisted_pullups", "negative_pullups"],
    progressions: ["chinups"],
  }),
  ex({
    id: "chinups",
    category: "pull",
    level: "intermediate",
    equipment: ["pull_up_bar"],
    muscles: ["back", "biceps"],
    name: { en: "Chin-ups", ru: "Подтягивания обратным хватом" },
    instructions: {
      en: [
        "Palms toward you, shoulder-width grip.",
        "Pull until chin clears bar.",
        "Control the descent.",
      ],
      ru: [
        "Ладони к себе, хват на ширине плеч.",
        "Подтяни, пока подбородок выше перекладины.",
        "Контролируй опускание.",
      ],
    },
    commonMistakes: {
      en: ["Swinging", "Elbows flaring forward"],
      ru: ["Раскачка", "Локти уходят вперёд"],
    },
    regressions: ["pullups"],
    progressions: ["pullups"],
  }),
  ex({
    id: "backpack_rows",
    category: "pull",
    level: "beginner",
    equipment: ["backpack"],
    muscles: ["back"],
    name: { en: "Backpack rows", ru: "Тяга рюкзака" },
    instructions: {
      en: [
        "Hinge forward, backpack in one or both hands.",
        "Row to hip, elbow along body.",
        "3 sets of 10–15.",
      ],
      ru: [
        "Наклон вперёд, рюкзак в руках.",
        "Тяга к бедру, локоть вдоль корпуса.",
        "3 подхода по 10–15.",
      ],
    },
    commonMistakes: {
      en: ["Rounding lower back", "Shrugging"],
      ru: ["Округление поясницы", "Поднимают плечи"],
    },
    contraindications: ["back"],
    regressions: ["australian_rows"],
    progressions: ["pullups"],
  }),

  // Push
  ex({
    id: "wall_pushups",
    category: "push",
    level: "absolute_beginner",
    muscles: ["chest", "shoulders"],
    name: { en: "Wall push-ups", ru: "Отжимания от стены" },
    instructions: {
      en: [
        "Hands on wall at shoulder height.",
        "Body straight, lower chest to wall.",
        "Push back, 10–15 reps.",
      ],
      ru: [
        "Руки на стене на уровне плеч.",
        "Тело прямое, грудь к стене.",
        "Отжимись назад, 10–15 раз.",
      ],
    },
    commonMistakes: {
      en: ["Sagging hips", "Feet too close"],
      ru: ["Провисает таз", "Стопы слишком близко"],
    },
    progressions: ["incline_pushups", "knee_pushups"],
  }),
  ex({
    id: "incline_pushups",
    category: "push",
    level: "beginner",
    muscles: ["chest", "shoulders"],
    name: { en: "Incline push-ups", ru: "Отжимания на наклоне" },
    instructions: {
      en: [
        "Hands on bench, plank position.",
        "Lower chest to bench, elbows ~45°.",
        "3 sets of 8–12.",
      ],
      ru: [
        "Руки на опоре, планка.",
        "Грудь к опоре, локти ~45°.",
        "3 подхода по 8–12.",
      ],
    },
    commonMistakes: {
      en: ["Hips piking", "Head jutting forward"],
      ru: ["Таз вверх", "Голова вперёд"],
    },
    regressions: ["wall_pushups"],
    progressions: ["pushups"],
  }),
  ex({
    id: "knee_pushups",
    category: "push",
    level: "beginner",
    muscles: ["chest", "triceps"],
    name: { en: "Knee push-ups", ru: "Отжимания с колен" },
    instructions: {
      en: [
        "Knees down, hands under shoulders.",
        "Lower chest between hands.",
        "Maintain straight line hip to knees.",
      ],
      ru: [
        "На коленях, руки под плечами.",
        "Опускай грудь между руками.",
        "Линия бёдра–колени прямая.",
      ],
    },
    commonMistakes: {
      en: ["Incomplete depth", "Elbows flaring 90°"],
      ru: ["Мелко", "Локти в стороны 90°"],
    },
    regressions: ["incline_pushups"],
    progressions: ["pushups"],
  }),
  ex({
    id: "pushups",
    category: "push",
    level: "novice",
    muscles: ["chest", "triceps", "shoulders"],
    name: { en: "Push-ups", ru: "Отжимания" },
    instructions: {
      en: [
        "Plank, hands shoulder-width.",
        "Lower until chest nearly touches floor.",
        "Full lockout at top, 8–20 reps.",
      ],
      ru: [
        "Планка, руки на ширине плеч.",
        "Опускайся почти до пола.",
        "Полное выпрямление вверху, 8–20 раз.",
      ],
    },
    commonMistakes: {
      en: ["Sagging hips", "Half reps"],
      ru: ["Провисает таз", "Неполная амплитуда"],
    },
    regressions: ["knee_pushups", "incline_pushups"],
    progressions: ["decline_pushups", "pike_pushups"],
  }),
  ex({
    id: "decline_pushups",
    category: "push",
    level: "intermediate",
    muscles: ["chest", "shoulders"],
    name: { en: "Decline push-ups", ru: "Отжимания с ногами на возвышении" },
    instructions: {
      en: [
        "Feet elevated on stable surface.",
        "Lower with control, push explosively.",
        "6–12 reps.",
      ],
      ru: [
        "Ноги на устойчивой опоре.",
        "Контролируемое опускание, мощный подъём.",
        "6–12 повторов.",
      ],
    },
    commonMistakes: {
      en: ["Piking hips", "Neck strain"],
      ru: ["Таз вверх", "Перегрузка шеи"],
    },
    regressions: ["pushups"],
    progressions: ["pike_pushups"],
  }),
  ex({
    id: "dips",
    category: "push",
    level: "intermediate",
    equipment: ["parallel_bars"],
    muscles: ["chest", "triceps", "shoulders"],
    name: { en: "Dips", ru: "Отжимания на брусьях" },
    instructions: {
      en: [
        "Support on bars, slight forward lean.",
        "Lower until upper arms parallel.",
        "Press up without shrugging.",
      ],
      ru: [
        "Упор на брусьях, лёгкий наклон вперёд.",
        "Опускайся до параллели плеч.",
        "Выжим без подъёма плеч.",
      ],
    },
    commonMistakes: {
      en: ["Going too deep", "Shrugging at top"],
      ru: ["Слишком глубоко", "Плечи к ушам"],
    },
    contraindications: ["shoulders"],
    regressions: ["pushups"],
    progressions: ["dips"],
  }),
  ex({
    id: "pike_pushups",
    category: "push",
    level: "intermediate",
    muscles: ["shoulders", "triceps"],
    name: { en: "Pike push-ups", ru: "Отжимания в пике" },
    instructions: {
      en: [
        "Hips high, head toward floor.",
        "Lower top of head between hands.",
        "Press back to pike, 6–10 reps.",
      ],
      ru: [
        "Таз высоко, голова к полу.",
        "Опускай макушку между руками.",
        "Выжим обратно, 6–10 раз.",
      ],
    },
    commonMistakes: {
      en: ["Bending elbows out wide", "Collapsing lower back"],
      ru: ["Локти в стороны", "Провал поясницы"],
    },
    contraindications: ["shoulders"],
    regressions: ["decline_pushups", "pushups"],
  }),

  // Legs
  ex({
    id: "chair_squats",
    category: "legs",
    level: "absolute_beginner",
    muscles: ["quads", "glutes"],
    name: { en: "Chair squats", ru: "Присед к стулу" },
    instructions: {
      en: [
        "Stand in front of chair, feet hip-width.",
        "Sit back lightly touching chair, stand up.",
        "10–15 reps, control tempo.",
      ],
      ru: [
        "Стоя перед стулом, стопы на ширине бёдер.",
        "Садись касаясь стула, вставай.",
        "10–15 раз, контроль темпа.",
      ],
    },
    commonMistakes: {
      en: ["Knees collapsing inward", "Leaning too far forward"],
      ru: ["Колени внутрь", "Сильный наклон вперёд"],
    },
    contraindications: ["knees"],
    progressions: ["bodyweight_squats"],
  }),
  ex({
    id: "bodyweight_squats",
    category: "legs",
    level: "beginner",
    muscles: ["quads", "glutes"],
    name: { en: "Bodyweight squats", ru: "Приседания с собственным весом" },
    instructions: {
      en: [
        "Feet shoulder-width, toes slightly out.",
        "Sit hips back and down, chest up.",
        "Knees track over toes, 12–20 reps.",
      ],
      ru: [
        "Стопы на ширине плеч, носки чуть в стороны.",
        "Таз назад и вниз, грудь вверх.",
        "Колени по линии носков, 12–20 раз.",
      ],
    },
    commonMistakes: {
      en: ["Heels lifting", "Rounding back"],
      ru: ["Пятки отрываются", "Округление спины"],
    },
    contraindications: ["knees"],
    regressions: ["chair_squats"],
    progressions: ["split_squats", "lunges"],
  }),
  ex({
    id: "lunges",
    category: "legs",
    level: "novice",
    muscles: ["quads", "glutes"],
    name: { en: "Lunges", ru: "Выпады" },
    instructions: {
      en: [
        "Step forward, drop back knee toward floor.",
        "Front knee over ankle, torso upright.",
        "8–12 per leg.",
      ],
      ru: [
        "Шаг вперёд, заднее колено к полу.",
        "Переднее колено над стопой, корпус ровно.",
        "8–12 на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Short step", "Front knee caving"],
      ru: ["Короткий шаг", "Колено заваливается"],
    },
    contraindications: ["knees"],
    regressions: ["bodyweight_squats"],
    progressions: ["split_squats"],
  }),
  ex({
    id: "split_squats",
    category: "legs",
    level: "novice",
    muscles: ["quads", "glutes"],
    name: { en: "Split squats", ru: "Сплит-присед" },
    instructions: {
      en: [
        "Staggered stance, back foot elevated optional.",
        "Lower until front thigh parallel.",
        "8–10 per leg.",
      ],
      ru: [
        "Разножка, задняя стопа на опоре по желанию.",
        "Опускайся до параллели бедра.",
        "8–10 на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Torso collapse", "Knee over toes excessively"],
      ru: ["Провал корпуса", "Колено далеко за носок"],
    },
    contraindications: ["knees"],
    regressions: ["lunges"],
    progressions: ["bulgarian_split_squats"],
  }),
  ex({
    id: "bulgarian_split_squats",
    category: "legs",
    level: "intermediate",
    muscles: ["quads", "glutes"],
    name: { en: "Bulgarian split squats", ru: "Болгарский сплит-присед" },
    instructions: {
      en: [
        "Rear foot on bench, front foot forward.",
        "Lower under control, drive through front heel.",
        "6–10 per leg.",
      ],
      ru: [
        "Задняя стопа на опоре, передняя впереди.",
        "Контролируемое опускание, толчок через переднюю пятку.",
        "6–10 на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Deep knee pain push", "Losing balance"],
      ru: ["Боль в колене на глубине", "Теряют баланс"],
    },
    contraindications: ["knees"],
    regressions: ["split_squats"],
  }),
  ex({
    id: "step_ups",
    category: "legs",
    level: "beginner",
    muscles: ["quads", "glutes"],
    name: { en: "Step-ups", ru: "Зашагивания на опору" },
    instructions: {
      en: [
        "Use stable box or step knee-height.",
        "Drive through whole foot, no push-off back leg.",
        "10 per leg.",
      ],
      ru: [
        "Устойчивая опора по высоте колена.",
        "Толчок всей стопой, без отталкивания задней ногой.",
        "10 на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Box too high", "Knee valgus"],
      ru: ["Слишком высокая опора", "Колено внутрь"],
    },
    contraindications: ["knees"],
    regressions: ["chair_squats"],
  }),
  ex({
    id: "calf_raises",
    category: "legs",
    level: "absolute_beginner",
    muscles: ["calves"],
    name: { en: "Calf raises", ru: "Подъёмы на носки" },
    instructions: {
      en: [
        "Stand holding wall for balance.",
        "Rise on toes, pause, lower slowly.",
        "15–20 reps.",
      ],
      ru: [
        "Стоя, опора на стену.",
        "Подъём на носки, пауза, медленно вниз.",
        "15–20 раз.",
      ],
    },
    commonMistakes: {
      en: ["Bouncing", "Incomplete range"],
      ru: ["Пружинят", "Короткая амплитуда"],
    },
  }),

  // Core
  ex({
    id: "dead_bug",
    category: "core",
    level: "absolute_beginner",
    muscles: ["core"],
    name: { en: "Dead bug", ru: "Мёртвый жук" },
    instructions: {
      en: [
        "On back, arms up, knees 90°.",
        "Extend opposite arm and leg slowly.",
        "Keep lower back pressed to floor.",
      ],
      ru: [
        "На спине, руки вверх, колени 90°.",
        "Вытягивай противоположные руку и ногу.",
        "Поясница прижата к полу.",
      ],
    },
    commonMistakes: {
      en: ["Arching back", "Moving too fast"],
      ru: ["Прогиб поясницы", "Слишком быстро"],
    },
    progressions: ["plank"],
  }),
  ex({
    id: "plank",
    category: "core",
    level: "beginner",
    muscles: ["core"],
    name: { en: "Plank", ru: "Планка" },
    instructions: {
      en: [
        "Forearms and toes, body straight.",
        "Brace core, glutes engaged.",
        "Hold 30–90 seconds.",
      ],
      ru: [
        "На предплечьях и носках, тело прямое.",
        "Напряги кор и ягодицы.",
        "Держи 30–90 сек.",
      ],
    },
    commonMistakes: {
      en: ["Hips sagging", "Looking up"],
      ru: ["Провисает таз", "Смотрят вверх"],
    },
    regressions: ["dead_bug"],
    progressions: ["side_plank", "hollow_hold"],
  }),
  ex({
    id: "side_plank",
    category: "core",
    level: "novice",
    muscles: ["core", "obliques"],
    name: { en: "Side plank", ru: "Боковая планка" },
    instructions: {
      en: [
        "Forearm perpendicular, stack feet.",
        "Lift hips in straight line.",
        "30–45 seconds per side.",
      ],
      ru: [
        "Предплечье перпендикулярно, стопы в стопу.",
        "Подними таз в линию.",
        "30–45 сек на сторону.",
      ],
    },
    commonMistakes: {
      en: ["Rotating forward", "Dropping hips"],
      ru: ["Поворот вперёд", "Опускают таз"],
    },
    regressions: ["plank"],
  }),
  ex({
    id: "hollow_hold",
    category: "core",
    level: "intermediate",
    muscles: ["core"],
    name: { en: "Hollow hold", ru: "«Чашечка»" },
    instructions: {
      en: [
        "On back, lift shoulders and legs slightly.",
        "Lower back flat, arms by ears.",
        "Hold 20–40 seconds.",
      ],
      ru: [
        "На спине, плечи и ноги слегка от пола.",
        "Поясница прижата, руки у ушей.",
        "Держи 20–40 сек.",
      ],
    },
    commonMistakes: {
      en: ["Lower back peeling up", "Bending knees too much"],
      ru: ["Поясница отрывается", "Сильный сгиб колен"],
    },
    contraindications: ["back"],
    regressions: ["plank"],
  }),
  ex({
    id: "hanging_knee_raises",
    category: "core",
    level: "intermediate",
    equipment: ["pull_up_bar"],
    muscles: ["core", "hip flexors"],
    name: { en: "Hanging knee raises", ru: "Подъём коленей в висе" },
    instructions: {
      en: [
        "Hang from bar, minimize swing.",
        "Raise knees to chest with control.",
        "8–12 reps.",
      ],
      ru: [
        "Вис на турнике, без раскачки.",
        "Подтяни колени к груди с контролем.",
        "8–12 раз.",
      ],
    },
    commonMistakes: {
      en: ["Excessive kip", "Dropping legs fast"],
      ru: ["Сильный читинг", "Бросают ноги вниз"],
    },
    regressions: ["leg_raises", "dead_bug"],
  }),
  ex({
    id: "leg_raises",
    category: "core",
    level: "novice",
    muscles: ["core", "hip flexors"],
    name: { en: "Lying leg raises", ru: "Подъёмы ног лёжа" },
    instructions: {
      en: [
        "On back, hands under hips optional.",
        "Raise legs to 90°, lower without arching.",
        "10–15 reps.",
      ],
      ru: [
        "На спине, руки под ягодицами по желанию.",
        "Подними ноги до 90°, опускай без прогиба.",
        "10–15 раз.",
      ],
    },
    commonMistakes: {
      en: ["Arching lower back", "Using momentum"],
      ru: ["Прогиб поясницы", "Инерция"],
    },
    contraindications: ["back"],
    regressions: ["dead_bug"],
    progressions: ["hanging_knee_raises"],
  }),

  // Cardio
  ex({
    id: "walk",
    category: "cardio",
    level: "absolute_beginner",
    muscles: ["legs", "cardio"],
    name: { en: "Walk", ru: "Ходьба" },
    instructions: {
      en: [
        "Steady pace you can speak through.",
        "10–30 minutes.",
        "Upright posture.",
      ],
      ru: [
        "Темп, в котором можно говорить.",
        "10–30 минут.",
        "Ровная осанка.",
      ],
    },
    commonMistakes: {
      en: ["Starting too fast", "Slouching"],
      ru: ["Слишком быстрый старт", "Сутулость"],
    },
    progressions: ["easy_run"],
  }),
  ex({
    id: "easy_run",
    category: "cardio",
    level: "beginner",
    muscles: ["legs", "cardio"],
    name: { en: "Easy run", ru: "Лёгкий бег" },
    instructions: {
      en: [
        "Conversational pace.",
        "15–25 minutes.",
        "Soft landing, short strides.",
      ],
      ru: [
        "Темп разговора.",
        "15–25 минут.",
        "Мягкое приземление, короткий шаг.",
      ],
    },
    commonMistakes: {
      en: ["Running too hard", "Overstriding"],
      ru: ["Бег слишком быстро", "Длинный шаг"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["walk"],
  }),
  ex({
    id: "intervals",
    category: "cardio",
    level: "novice",
    muscles: ["cardio", "legs"],
    name: { en: "Run/walk intervals", ru: "Интервалы бег/ходьба" },
    instructions: {
      en: [
        "1 min brisk / 2 min walk.",
        "Repeat 6–8 rounds.",
        "Keep form on brisk portions.",
      ],
      ru: [
        "1 мин быстрее / 2 мин ходьба.",
        "6–8 кругов.",
        "Следи за техникой на быстрых отрезках.",
      ],
    },
    commonMistakes: {
      en: ["Sprinting intervals", "Skipping walk recovery"],
      ru: ["Спринт вместо темпа", "Пропуск ходьбы"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["walk"],
  }),
  ex({
    id: "low_impact_conditioning",
    category: "cardio",
    level: "beginner",
    muscles: ["cardio", "legs"],
    name: { en: "Low-impact conditioning", ru: "Щадящая кондиция" },
    instructions: {
      en: [
        "March in place 30 sec, brisk walk 2 min.",
        "Repeat 3–4 rounds.",
        "Stay tall, breathe steadily.",
      ],
      ru: [
        "Марш на месте 30 сек, быстрая ходьба 2 мин.",
        "3–4 круга.",
        "Осанка ровная, дыхание спокойное.",
      ],
    },
    commonMistakes: {
      en: ["Rushing the march", "Holding breath"],
      ru: ["Слишком быстрый марш", "Задержка дыхания"],
    },
    contraindications: ["knees"],
    regressions: ["walk"],
    progressions: ["brisk_walk"],
  }),
  ex({
    id: "mountain_climbers",
    category: "cardio",
    level: "novice",
    muscles: ["core", "cardio"],
    name: { en: "Mountain climbers", ru: "Скалолаз" },
    instructions: {
      en: [
        "High plank, drive knees alternately.",
        "Hips level, 30–45 seconds.",
        "Controlled speed.",
      ],
      ru: [
        "Планка, поочерёдно колени к груди.",
        "Таз ровно, 30–45 сек.",
        "Контролируемая скорость.",
      ],
    },
    commonMistakes: {
      en: ["Hips bouncing", "Feet landing wide"],
      ru: ["Таз прыгает", "Стопы широко"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["brisk_walk"],
  }),
  ex({
    id: "burpees",
    category: "cardio",
    level: "intermediate",
    muscles: ["full body", "cardio"],
    name: { en: "Burpees", ru: "Бёрпи" },
    instructions: {
      en: [
        "Squat, plank, optional push-up.",
        "Jump or step feet to hands, stand up.",
        "6–10 quality reps.",
      ],
      ru: [
        "Присед, планка, отжимание по желанию.",
        "Шаг или прыжок ног к рукам, встать.",
        "6–10 качественных повторов.",
      ],
    },
    commonMistakes: {
      en: ["Collapsed plank", "Excessive volume when tired"],
      ru: ["Провал в планке", "Слишком много в усталости"],
    },
    contraindications: ["knees", "overweight"],
    regressions: ["mountain_climbers"],
  }),

  // Cooldown / mobility
  ex({
    id: "child_pose",
    category: "mobility",
    level: "absolute_beginner",
    muscles: ["back", "hips"],
    name: { en: "Child's pose", ru: "Поза ребёнка" },
    instructions: {
      en: [
        "Knees wide optional, sit hips to heels.",
        "Arms extended, breathe into back.",
        "Hold 45–60 seconds.",
      ],
      ru: [
        "Колени шире по желанию, таз к пяткам.",
        "Руки вперёд, дыхание в спину.",
        "Держи 45–60 сек.",
      ],
    },
    commonMistakes: {
      en: ["Forcing hips down", "Holding breath"],
      ru: ["Насильно опускают таз", "Задержка дыхания"],
    },
  }),
  ex({
    id: "hamstring_stretch",
    category: "cooldown",
    level: "absolute_beginner",
    muscles: ["hamstrings"],
    name: { en: "Hamstring stretch", ru: "Растяжка задней поверхности бедра" },
    instructions: {
      en: [
        "Seated or standing, hinge at hips.",
        "Keep spine long, 30 sec per side.",
      ],
      ru: [
        "Сидя или стоя, наклон от бёдер.",
        "Спина длинная, 30 сек на сторону.",
      ],
    },
    commonMistakes: {
      en: ["Rounding upper back", "Bouncing"],
      ru: ["Округление груди", "Пружинят"],
    },
  }),
  ex({
    id: "quad_stretch",
    category: "cooldown",
    level: "absolute_beginner",
    muscles: ["quads"],
    name: { en: "Quad stretch", ru: "Растяжка квадрицепса" },
    instructions: {
      en: [
        "Stand, pull heel to glute.",
        "Knees together, hips forward.",
        "30 sec per leg.",
      ],
      ru: [
        "Стоя, пятку к ягодице.",
        "Колени вместе, таз вперёд.",
        "30 сек на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Arching lower back", "Knee flaring out"],
      ru: ["Прогиб поясницы", "Колено в сторону"],
    },
    contraindications: ["knees"],
  }),
  ex({
    id: "chest_stretch",
    category: "cooldown",
    level: "absolute_beginner",
    muscles: ["chest"],
    name: { en: "Chest stretch", ru: "Растяжка груди" },
    instructions: {
      en: [
        "Forearm on wall, elbow 90°.",
        "Rotate body away gently.",
        "30 sec per side.",
      ],
      ru: [
        "Предплечье на стене, локоть 90°.",
        "Мягко поверни корпус.",
        "30 сек на сторону.",
      ],
    },
    commonMistakes: {
      en: ["Shrugging shoulder", "Over-rotating"],
      ru: ["Поднимают плечо", "Слишком сильный поворот"],
    },
  }),
  ex({
    id: "lat_stretch",
    category: "cooldown",
    level: "absolute_beginner",
    muscles: ["lats"],
    name: { en: "Lat stretch", ru: "Растяжка широчайших" },
    instructions: {
      en: [
        "Hang or reach overhead to side.",
        "Feel stretch along side body.",
        "30 sec per side.",
      ],
      ru: [
        "Вис или рука вверх в сторону.",
        "Растяжение по боку корпуса.",
        "30 сек на сторону.",
      ],
    },
    commonMistakes: {
      en: ["Holding breath", "Jerking into position"],
      ru: ["Задержка дыхания", "Рывок в позицию"],
    },
  }),
  ex({
    id: "calf_stretch",
    category: "cooldown",
    level: "absolute_beginner",
    muscles: ["calves"],
    name: { en: "Calf stretch", ru: "Растяжка икр" },
    instructions: {
      en: [
        "Hands on wall, back leg straight.",
        "Press heel down, lean forward.",
        "30 sec per leg.",
      ],
      ru: [
        "Руки на стене, задняя нога прямая.",
        "Пятка в пол, наклон вперёд.",
        "30 сек на ногу.",
      ],
    },
    commonMistakes: {
      en: ["Heel lifting", "Bent back leg only"],
      ru: ["Пятка отрывается", "Сгибают только заднее колено"],
    },
  }),
];

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e])
);

export function getExercise(id: string): Exercise | undefined {
  return EXERCISE_BY_ID[id];
}
