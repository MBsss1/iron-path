import type { StageBand, TrackProgression } from "./types";

function band(from: number, to: number, pool: StageBand["pool"]): StageBand {
  return { fromRung: from, toRung: to, pool };
}

const pullStages: StageBand[] = [
  band(0, 1, [
    { exerciseId: "dead_hang", prescription: { en: "3 × 15–20 sec", ru: "3 × 15–20 сек" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "scapular_pullups", prescription: { en: "3 × 6", ru: "3 × 6" }, restSeconds: 60, role: "main", weight: 9 },
    { exerciseId: "australian_rows", prescription: { en: "3 × 8", ru: "3 × 8" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "scapular_pulls", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 45, role: "accessory", weight: 7 },
    { exerciseId: "plank", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 45, role: "accessory", weight: 5 },
  ]),
  band(1, 3, [
    { exerciseId: "pullups", prescription: { en: "5 × 1", ru: "5 × 1" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "negative_pullups", prescription: { en: "3 × 3", ru: "3 × 3" }, restSeconds: 90, role: "main", weight: 9 },
    { exerciseId: "australian_rows", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "dead_hang", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 60, role: "accessory", weight: 7 },
    { exerciseId: "scapular_pullups", prescription: { en: "3 × 8", ru: "3 × 8" }, restSeconds: 60, role: "accessory", weight: 6 },
  ]),
  band(3, 5, [
    { exerciseId: "pullups", prescription: { en: "5 × 2", ru: "5 × 2" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "australian_rows", prescription: { en: "4 × 10", ru: "4 × 10" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "negative_pullups", prescription: { en: "3 × 3", ru: "3 × 3" }, restSeconds: 90, role: "accessory", weight: 7 },
    { exerciseId: "dead_hang", prescription: { en: "3 × 40 sec", ru: "3 × 40 сек" }, restSeconds: 60, role: "accessory", weight: 6 },
  ]),
  band(5, 8, [
    { exerciseId: "pullups", prescription: { en: "5 × 3", ru: "5 × 3" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "australian_rows", prescription: { en: "4 × 12", ru: "4 × 12" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "negative_pullups", prescription: { en: "3 × 4", ru: "3 × 4" }, restSeconds: 90, role: "accessory", weight: 7 },
    { exerciseId: "chinups", prescription: { en: "3 × 4", ru: "3 × 4" }, restSeconds: 90, role: "accessory", weight: 6 },
  ]),
  band(8, 10, [
    { exerciseId: "pullups", prescription: { en: "5 × 4", ru: "5 × 4" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "australian_rows", prescription: { en: "4 × 15", ru: "4 × 15" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "chinups", prescription: { en: "3 × 5", ru: "3 × 5" }, restSeconds: 90, role: "accessory", weight: 7 },
  ]),
  band(10, 12, [
    { exerciseId: "pullups", prescription: { en: "5 × 5", ru: "5 × 5" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "pullups", prescription: { en: "4 × max−2", ru: "4 × макс−2" }, restSeconds: 120, role: "main", weight: 8 },
    { exerciseId: "australian_rows", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 75, role: "accessory", weight: 6 },
  ]),
  band(12, 15, [
    { exerciseId: "pullups", prescription: { en: "6 × 5", ru: "6 × 5" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "pullups", prescription: { en: "30 reps min sets", ru: "30 повт. мин. подходов" }, restSeconds: 120, role: "main", weight: 8 },
    { exerciseId: "chinups", prescription: { en: "4 × 6", ru: "4 × 6" }, restSeconds: 90, role: "accessory", weight: 7 },
  ]),
];

const pushStages: StageBand[] = [
  band(0, 5, [
    { exerciseId: "incline_pushups", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "knee_pushups", prescription: { en: "3 × 8", ru: "3 × 8" }, restSeconds: 60, role: "main", weight: 9 },
    { exerciseId: "wall_pushups", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 45, role: "accessory", weight: 7 },
    { exerciseId: "plank", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 45, role: "accessory", weight: 5 },
  ]),
  band(5, 10, [
    { exerciseId: "knee_pushups", prescription: { en: "4 × 8", ru: "4 × 8" }, restSeconds: 60, role: "main", weight: 9 },
    { exerciseId: "incline_pushups", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 60, role: "main", weight: 8 },
    { exerciseId: "pushups", prescription: { en: "5 × 3", ru: "5 × 3" }, restSeconds: 75, role: "main", weight: 10 },
    { exerciseId: "plank", prescription: { en: "3 × 40 sec", ru: "3 × 40 сек" }, restSeconds: 45, role: "accessory", weight: 6 },
  ]),
  band(10, 20, [
    { exerciseId: "pushups", prescription: { en: "4 × 8", ru: "4 × 8" }, restSeconds: 75, role: "main", weight: 10 },
    { exerciseId: "pushups", prescription: { en: "5 × 6", ru: "5 × 6" }, restSeconds: 75, role: "main", weight: 9 },
    { exerciseId: "decline_pushups", prescription: { en: "3 × 5", ru: "3 × 5" }, restSeconds: 75, role: "accessory", weight: 7 },
    { exerciseId: "plank", prescription: { en: "3 × 60 sec", ru: "3 × 60 сек" }, restSeconds: 45, role: "accessory", weight: 6 },
  ]),
  band(20, 30, [
    { exerciseId: "pushups", prescription: { en: "5 × 10", ru: "5 × 10" }, restSeconds: 75, role: "main", weight: 10 },
    { exerciseId: "pushups", prescription: { en: "3 × 15", ru: "3 × 15" }, restSeconds: 90, role: "main", weight: 8 },
    { exerciseId: "decline_pushups", prescription: { en: "3 × 8", ru: "3 × 8" }, restSeconds: 75, role: "accessory", weight: 7 },
  ]),
  band(30, 40, [
    { exerciseId: "pushups", prescription: { en: "5 × 15", ru: "5 × 15" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "pushups", prescription: { en: "3 × 20", ru: "3 × 20" }, restSeconds: 90, role: "main", weight: 8 },
    { exerciseId: "dips", prescription: { en: "3 × 8", ru: "3 × 8" }, restSeconds: 90, role: "accessory", weight: 7 },
  ]),
  band(40, 50, [
    { exerciseId: "pushups", prescription: { en: "5 × 20", ru: "5 × 20" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "pushups", prescription: { en: "50 reps min sets", ru: "50 повт. мин. подходов" }, restSeconds: 120, role: "main", weight: 8 },
    { exerciseId: "dips", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 90, role: "accessory", weight: 7 },
  ]),
  band(50, 60, [
    { exerciseId: "pushups", prescription: { en: "6 × 20", ru: "6 × 20" }, restSeconds: 90, role: "main", weight: 10 },
    { exerciseId: "pushups", prescription: { en: "60 reps min sets", ru: "60 повт. мин. подходов" }, restSeconds: 120, role: "main", weight: 9 },
    { exerciseId: "decline_pushups", prescription: { en: "4 × 12", ru: "4 × 12" }, restSeconds: 90, role: "accessory", weight: 7 },
  ]),
];

const squatStages: StageBand[] = [
  band(0, 20, [
    { exerciseId: "chair_squats", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 60, role: "main", weight: 9 },
    { exerciseId: "bodyweight_squats", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "step_ups", prescription: { en: "3 × 8 each leg", ru: "3 × 8 на ногу" }, restSeconds: 60, role: "accessory", weight: 7 },
    { exerciseId: "plank", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 45, role: "accessory", weight: 5 },
  ]),
  band(20, 40, [
    { exerciseId: "bodyweight_squats", prescription: { en: "3 × 15", ru: "3 × 15" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "lunges", prescription: { en: "3 × 8 each leg", ru: "3 × 8 на ногу" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "chair_squats", prescription: { en: "3 × 20 sec hold", ru: "3 × 20 сек у стены" }, restSeconds: 60, role: "accessory", weight: 7 },
  ]),
  band(40, 60, [
    { exerciseId: "bodyweight_squats", prescription: { en: "4 × 15", ru: "4 × 15" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "lunges", prescription: { en: "3 × 10 each leg", ru: "3 × 10 на ногу" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "bodyweight_squats", prescription: { en: "5 × 12", ru: "5 × 12" }, restSeconds: 60, role: "main", weight: 9 },
  ]),
  band(60, 80, [
    { exerciseId: "bodyweight_squats", prescription: { en: "4 × 20", ru: "4 × 20" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "lunges", prescription: { en: "3 × 12 each leg", ru: "3 × 12 на ногу" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "split_squats", prescription: { en: "3 × 8 each leg", ru: "3 × 8 на ногу" }, restSeconds: 75, role: "accessory", weight: 7 },
  ]),
  band(80, 100, [
    { exerciseId: "bodyweight_squats", prescription: { en: "5 × 20", ru: "5 × 20" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "lunges", prescription: { en: "3 × 15 each leg", ru: "3 × 15 на ногу" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "bodyweight_squats", prescription: { en: "4 × 25", ru: "4 × 25" }, restSeconds: 60, role: "main", weight: 9 },
  ]),
  band(100, 120, [
    { exerciseId: "bodyweight_squats", prescription: { en: "5 × 25", ru: "5 × 25" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "lunges", prescription: { en: "4 × 15 each leg", ru: "4 × 15 на ногу" }, restSeconds: 75, role: "main", weight: 8 },
    { exerciseId: "split_squats", prescription: { en: "3 × 10 each leg", ru: "3 × 10 на ногу" }, restSeconds: 75, role: "accessory", weight: 7 },
  ]),
  band(120, 150, [
    { exerciseId: "bodyweight_squats", prescription: { en: "5 × 30", ru: "5 × 30" }, restSeconds: 60, role: "main", weight: 10 },
    { exerciseId: "bodyweight_squats", prescription: { en: "150 reps min sets", ru: "150 повт. мин. подходов" }, restSeconds: 90, role: "main", weight: 9 },
    { exerciseId: "lunges", prescription: { en: "4 × 20 each leg", ru: "4 × 20 на ногу" }, restSeconds: 75, role: "accessory", weight: 7 },
  ]),
];

const plankStages: StageBand[] = [
  band(0, 30, [
    { exerciseId: "plank", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "dead_bug", prescription: { en: "3 × 10", ru: "3 × 10" }, restSeconds: 45, role: "main", weight: 8 },
    { exerciseId: "side_plank", prescription: { en: "2 × 20 sec/side", ru: "2 × 20 сек/сторона" }, restSeconds: 30, role: "accessory", weight: 7 },
  ]),
  band(30, 60, [
    { exerciseId: "plank", prescription: { en: "3 × 45 sec", ru: "3 × 45 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "plank", prescription: { en: "4 × 40 sec", ru: "4 × 40 сек" }, restSeconds: 45, role: "main", weight: 9 },
    { exerciseId: "dead_bug", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 45, role: "accessory", weight: 7 },
    { exerciseId: "side_plank", prescription: { en: "3 × 25 sec/side", ru: "3 × 25 сек/сторона" }, restSeconds: 30, role: "accessory", weight: 6 },
  ]),
  band(60, 90, [
    { exerciseId: "plank", prescription: { en: "3 × 60 sec", ru: "3 × 60 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "dead_bug", prescription: { en: "3 × 15", ru: "3 × 15" }, restSeconds: 45, role: "main", weight: 8 },
    { exerciseId: "side_plank", prescription: { en: "3 × 30 sec/side", ru: "3 × 30 сек/сторона" }, restSeconds: 30, role: "accessory", weight: 7 },
  ]),
  band(90, 120, [
    { exerciseId: "plank", prescription: { en: "3 × 75 sec", ru: "3 × 75 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "hollow_hold", prescription: { en: "3 × 30 sec", ru: "3 × 30 сек" }, restSeconds: 45, role: "main", weight: 8 },
    { exerciseId: "side_plank", prescription: { en: "3 × 40 sec/side", ru: "3 × 40 сек/сторона" }, restSeconds: 30, role: "accessory", weight: 7 },
  ]),
  band(120, 150, [
    { exerciseId: "plank", prescription: { en: "3 × 90 sec", ru: "3 × 90 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "leg_raises", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 60, role: "main", weight: 8 },
    { exerciseId: "side_plank", prescription: { en: "3 × 45 sec/side", ru: "3 × 45 сек/сторона" }, restSeconds: 30, role: "accessory", weight: 7 },
  ]),
  band(150, 180, [
    { exerciseId: "plank", prescription: { en: "3 × 120 sec", ru: "3 × 120 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "hollow_hold", prescription: { en: "3 × 40 sec", ru: "3 × 40 сек" }, restSeconds: 45, role: "main", weight: 8 },
    { exerciseId: "leg_raises", prescription: { en: "3 × 15", ru: "3 × 15" }, restSeconds: 60, role: "accessory", weight: 7 },
  ]),
  band(180, 240, [
    { exerciseId: "plank", prescription: { en: "3 × 180 sec", ru: "3 × 180 сек" }, restSeconds: 45, role: "main", weight: 10 },
    { exerciseId: "plank", prescription: { en: "1 × max time", ru: "1 × макс. время" }, restSeconds: 0, role: "main", weight: 9 },
    { exerciseId: "hanging_knee_raises", prescription: { en: "3 × 12", ru: "3 × 12" }, restSeconds: 60, role: "accessory", weight: 7 },
  ]),
];

const runStages: StageBand[] = [
  band(0, 5, [
    { exerciseId: "brisk_walk", prescription: { en: "12 min brisk walk", ru: "12 мин быстрая ходьба" }, restSeconds: 0, role: "conditioning", weight: 11 },
    { exerciseId: "brisk_walk", prescription: { en: "15 min brisk walk", ru: "15 мин быстрая ходьба" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "1 min run / 2 min walk × 8", ru: "1 мин бег / 2 мин ходьба × 8" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "2 min run / 2 min walk × 6", ru: "2 мин бег / 2 мин ходьба × 6" }, restSeconds: 0, role: "conditioning", weight: 8 },
    { exerciseId: "easy_run", prescription: { en: "3 min run / 2 min walk × 5", ru: "3 мин бег / 2 мин ходьба × 5" }, restSeconds: 0, role: "conditioning", weight: 7 },
  ]),
  band(5, 10, [
    { exerciseId: "easy_run", prescription: { en: "5 min run / 2 min walk × 3", ru: "5 мин бег / 2 мин ходьба × 3" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "8 min continuous", ru: "8 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "10 min continuous", ru: "10 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 8 },
  ]),
  band(10, 20, [
    { exerciseId: "easy_run", prescription: { en: "12 min continuous", ru: "12 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "15 min continuous", ru: "15 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "20 min continuous", ru: "20 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 8 },
  ]),
  band(20, 30, [
    { exerciseId: "easy_run", prescription: { en: "20 min continuous", ru: "20 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "25 min continuous", ru: "25 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "30 min continuous", ru: "30 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 8 },
  ]),
  band(30, 45, [
    { exerciseId: "easy_run", prescription: { en: "30 min continuous", ru: "30 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "35 min continuous", ru: "35 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "45 min continuous", ru: "45 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 8 },
  ]),
  band(45, 60, [
    { exerciseId: "easy_run", prescription: { en: "45 min continuous", ru: "45 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 10 },
    { exerciseId: "easy_run", prescription: { en: "50 min continuous", ru: "50 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 9 },
    { exerciseId: "easy_run", prescription: { en: "60 min continuous", ru: "60 мин непрерывно" }, restSeconds: 0, role: "conditioning", weight: 8 },
  ]),
];

export const TRACK_PROGRESSIONS: TrackProgression[] = [
  {
    id: "pullups",
    ladder: [1, 3, 5, 8, 10, 12, 15],
    i18nLabel: "coaching.milestone.pullups",
    i18nUnit: "coaching.milestone.unitReps",
    stages: pullStages,
  },
  {
    id: "pushups",
    ladder: [5, 10, 20, 30, 40, 50, 60],
    i18nLabel: "coaching.milestone.pushups",
    i18nUnit: "coaching.milestone.unitReps",
    stages: pushStages,
  },
  {
    id: "squats",
    ladder: [20, 40, 60, 80, 100, 120, 150],
    i18nLabel: "coaching.milestone.squats",
    i18nUnit: "coaching.milestone.unitReps",
    stages: squatStages,
  },
  {
    id: "plank",
    ladder: [30, 60, 90, 120, 150, 180, 240],
    i18nLabel: "coaching.milestone.plank",
    i18nUnit: "coaching.milestone.unitSeconds",
    stages: plankStages,
  },
  {
    id: "running",
    ladder: [5, 10, 20, 30, 45, 60],
    i18nLabel: "coaching.milestone.running",
    i18nUnit: "coaching.milestone.unitMinutes",
    stages: runStages,
  },
];

export function getTrackProgression(
  trackId: import("./types").ProgressionTrackId
): TrackProgression {
  const track = TRACK_PROGRESSIONS.find((t) => t.id === trackId);
  if (!track) throw new Error(`Unknown track: ${trackId}`);
  return track;
}
