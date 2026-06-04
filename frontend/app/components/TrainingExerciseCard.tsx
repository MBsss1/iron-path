"use client";

import type { GeneratedExercise } from "../data/workoutGeneratorV2";
import { getExerciseInfo, hasExerciseInfo } from "../data/exerciseLibrary";
import { useTranslation } from "../i18n/useTranslation";

type Lang = "en" | "ru";

type Props = {
  item: GeneratedExercise;
  lang: Lang;
  onDetails: (exerciseId: string) => void;
  onRestTimer: (exerciseId: string, restSeconds: number) => void;
};

export default function TrainingExerciseCard({
  item,
  lang,
  onDetails,
  onRestTimer,
}: Props) {
  const { t } = useTranslation();
  const restSeconds = item.restSeconds > 0 ? item.restSeconds : 60;
  const info = getExerciseInfo(item.exerciseId);
  const categoryKey = info
    ? `exerciseLibrary.category.${info.category}`
    : null;
  const categoryLabel = categoryKey ? t(categoryKey) : "";
  const hasDetails = hasExerciseInfo(item.exerciseId);

  return (
    <article className="border border-iron-border rounded-sm p-4 bg-iron-raised/60 shadow-[var(--iron-shadow-card)]">
      <h4 className="iron-heading text-base leading-snug">{item.name[lang]}</h4>
      <p className="mt-2 text-lg font-semibold text-iron-accent tabular-nums">
        {item.prescription[lang]}
      </p>
      {categoryLabel && (
        <p className="mt-1 text-xs text-iron-muted uppercase tracking-wide">
          {categoryLabel}
        </p>
      )}
      <p className="mt-2 text-sm text-iron-muted">
        {t("training.exercise.rest", { seconds: restSeconds })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRestTimer(item.exerciseId, restSeconds)}
          className="iron-interactive text-xs font-bold uppercase px-3 py-2 border border-iron-border rounded-sm bg-iron-panel text-iron-text min-h-[40px]"
        >
          {t("training.restTimer.button")}
        </button>
        {hasDetails && (
          <button
            type="button"
            onClick={() => onDetails(item.exerciseId)}
            className="iron-interactive text-xs font-bold uppercase px-3 py-2 text-iron-accent-dim hover:text-iron-accent min-h-[40px]"
          >
            {t("exerciseLibrary.details")}
          </button>
        )}
      </div>
    </article>
  );
}
