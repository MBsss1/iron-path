"use client";

import type { GeneratedExercise } from "../data/workoutGeneratorV2";
import { getExerciseInfo, hasExerciseInfo } from "../data/exerciseLibrary";
import { exerciseItemKey } from "../utils/trainingWorkoutView";
import { useTranslation } from "../i18n/useTranslation";

type Lang = "en" | "ru";

type Props = {
  item: GeneratedExercise;
  lang: Lang;
  variant: "warmup" | "workout";
  completed: boolean;
  onToggleComplete: (key: string) => void;
  onDetails: (exerciseId: string) => void;
  onOpenRest: (key: string, restSeconds: number, name: string) => void;
};

export default function TrainingExerciseCard({
  item,
  lang,
  variant,
  completed,
  onToggleComplete,
  onDetails,
  onOpenRest,
}: Props) {
  const { t } = useTranslation();
  const key = exerciseItemKey(item);
  const restSeconds = item.restSeconds > 0 ? item.restSeconds : 60;
  const info = getExerciseInfo(item.exerciseId);
  const categoryKey = info ? `exerciseLibrary.category.${info.category}` : null;
  const categoryLabel = categoryKey ? t(categoryKey) : null;
  const hasDetails = hasExerciseInfo(item.exerciseId);
  const compact = variant === "warmup";

  return (
    <article
      className={`border rounded-sm transition-colors ${
        completed
          ? "border-iron-accent/30 bg-iron-panel/50 opacity-80"
          : "border-iron-border bg-iron-raised/60 shadow-[var(--iron-shadow-card)]"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex gap-3 items-start">
        <button
          type="button"
          onClick={() => onToggleComplete(key)}
          className={`shrink-0 w-9 h-9 rounded-sm border flex items-center justify-center iron-interactive ${
            completed
              ? "border-iron-accent bg-iron-accent-dim/30 text-iron-accent"
              : "border-iron-border bg-iron-panel text-iron-muted"
          }`}
          aria-pressed={completed}
          aria-label={t("training.exercise.done")}
        >
          {completed ? (
            <span className="text-base font-bold" aria-hidden="true">
              ✓
            </span>
          ) : (
            <span className="w-3 h-3 rounded-sm border border-iron-muted/60" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`iron-heading leading-snug ${
              completed ? "text-iron-muted line-through decoration-iron-border" : "text-iron-text"
            } ${compact ? "text-sm" : "text-base"}`}
          >
            {item.name[lang]}
          </h4>
          <p
            className={`font-semibold text-iron-accent tabular-nums ${
              completed ? "opacity-70" : ""
            } ${compact ? "mt-1 text-base" : "mt-2 text-lg"}`}
          >
            {item.prescription[lang]}
          </p>

          {!compact && categoryLabel && (
            <span className="inline-block mt-2 text-[10px] uppercase tracking-wide px-2 py-0.5 border border-iron-border rounded-sm text-iron-muted">
              {categoryLabel}
            </span>
          )}

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`text-iron-muted ${compact ? "text-xs" : "text-sm"}`}>
              {t("training.exercise.restInline", { seconds: restSeconds })}
            </span>
            <button
              type="button"
              onClick={() => onOpenRest(key, restSeconds, item.name[lang])}
              className="iron-interactive w-8 h-8 flex items-center justify-center rounded-sm border border-iron-border bg-iron-panel text-sm"
              aria-label={t("training.restTimer.open")}
            >
              ⏱
            </button>
          </div>

          {hasDetails && (
            <button
              type="button"
              onClick={() => onDetails(item.exerciseId)}
              className={`iron-interactive mt-2 text-xs text-iron-accent-dim hover:text-iron-accent ${
                compact ? "font-medium" : "font-bold uppercase"
              }`}
            >
              {t("exerciseLibrary.details")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
