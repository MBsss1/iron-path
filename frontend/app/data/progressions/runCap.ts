import type { AssessmentInput } from "../fitnessAssessment";
import { resolveCardioTestType } from "../fitnessAssessment";
import type { StageExerciseSlot } from "./types";

const PULL_EXERCISE_IDS = new Set([
  "dead_hang",
  "scapular_pullups",
  "scapular_pulls",
  "australian_rows",
  "backpack_rows",
  "negative_pullups",
  "assisted_pullups",
  "pullups",
  "chinups",
]);

export function isPullExerciseId(exerciseId: string): boolean {
  return PULL_EXERCISE_IDS.has(exerciseId);
}

export function getRunMinutesCap(input: AssessmentInput): number | null {
  if (resolveCardioTestType(input) !== "run") return null;
  if (input.runMinutes === undefined) return null;
  return input.runMinutes + 2;
}

function capMinutesInText(text: string, max: number): string {
  return text.replace(/(\d+)\s*(min|мин)/gi, (match, num, unit) => {
    const value = Math.min(parseInt(num, 10), max);
    return unit.toLowerCase() === "мин"
      ? `${value} мин`
      : `${value} min`;
  });
}

/** Cap continuous run and per-segment run time to runMinutes + 2. */
export function capRunPrescription(
  slot: StageExerciseSlot,
  input: AssessmentInput
): StageExerciseSlot {
  const cap = getRunMinutesCap(input);
  if (cap === null || slot.exerciseId !== "easy_run") return slot;

  let en = slot.prescription.en;
  let ru = slot.prescription.ru;

  const continuousEn = en.match(/(\d+)\s*min continuous/i);
  if (continuousEn) {
    const mins = Math.min(parseInt(continuousEn[1], 10), cap);
    en = en.replace(continuousEn[0], `${mins} min continuous`);
    ru = ru.replace(/(\d+)\s*мин непрерывно/i, `${mins} мин непрерывно`);
  }

  en = en.replace(/(\d+)\s*min run/gi, (m, n) => {
    const v = Math.min(parseInt(n, 10), Math.max(1, cap - 2));
    return `${v} min run`;
  });
  ru = ru.replace(/(\d+)\s*мин бег/gi, (m, n) => {
    const v = Math.min(parseInt(n, 10), Math.max(1, cap - 2));
    return `${v} мин бег`;
  });

  if (!continuousEn && !/min run/i.test(en)) {
    en = capMinutesInText(en, cap);
    ru = capMinutesInText(ru, cap);
  }

  return { ...slot, prescription: { en, ru } };
}
