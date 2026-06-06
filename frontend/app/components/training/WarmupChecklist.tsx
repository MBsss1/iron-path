"use client";

import type { GeneratedExercise } from "../../data/workoutGeneratorV2";
import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { estimateWarmupMinutes } from "../../data/warmupBuilder";
import { exerciseItemKey } from "../../utils/trainingWorkoutView";
import { useTranslation } from "../../i18n/useTranslation";
import { hapticDone } from "../../utils/haptics";
import CompletionMoment from "../ui/CompletionMoment";

type Lang = "en" | "ru";

type Props = {
  items: GeneratedExercise[];
  completedIds: string[];
  lang: Lang;
  onToggleComplete: (key: string) => void;
};

export default function WarmupChecklist({
  items,
  completedIds,
  lang,
  onToggleComplete,
}: Props) {
  const { t } = useTranslation();
  const total = items.length;
  const done = items.filter((item) =>
    completedIds.includes(exerciseItemKey(item))
  ).length;
  const allDone = total === 0 || done >= total;
  const percent = total === 0 ? 100 : Math.round((done / total) * 100);
  const minutes = estimateWarmupMinutes(items);

  const handleToggle = (key: string, completed: boolean) => {
    if (!completed) hapticDone();
    onToggleComplete(key);
  };

  return (
    <div className="warmup-checklist space-y-3">
      <div className="border border-iron-border/70 rounded-sm px-3 py-3 bg-iron-panel/60">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="iron-heading text-lg text-iron-text">
            {t("training.block.warmupTitle")}
          </h3>
          <span className="text-xs font-semibold text-iron-accent shrink-0">
            {t("training.block.warmupDuration", { minutes })}
          </span>
        </div>
        <p className="text-xs text-iron-muted mt-1 leading-relaxed">
          {t("training.block.warmupDescription")}
        </p>
      </div>

      {total > 0 && (
        <div className="space-y-1.5" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-iron-muted">
            <span>{t("training.flow.warmupProgress", { percent })}</span>
            <span>
              {t("training.flow.progress", { done, total })}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-iron-border/80 overflow-hidden">
            <AnimatedProgressFill percent={percent} durationMs={400} />
          </div>
        </div>
      )}

      <ul className="space-y-1">
        {items.map((item) => {
          const key = exerciseItemKey(item);
          const completed = completedIds.includes(key);
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => handleToggle(key, completed)}
                className={`warmup-checklist-row w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left iron-interactive transition-colors ${
                  completed
                    ? "border-iron-accent/25 bg-iron-accent/5"
                    : "border-iron-border/60 bg-iron-raised/40 hover:bg-iron-raised/70"
                }`}
                aria-pressed={completed}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-sm border flex items-center justify-center text-xs font-bold ${
                    completed
                      ? "border-iron-accent bg-iron-accent-dim/30 text-iron-accent iron-done-pop"
                      : "border-iron-border bg-iron-panel text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  {completed ? "✓" : "·"}
                </span>
                <span
                  className={`flex-1 min-w-0 text-sm leading-snug ${
                    completed
                      ? "text-iron-muted line-through decoration-iron-border/80"
                      : "text-iron-text"
                  }`}
                >
                  {item.name[lang]}
                </span>
                <span className="shrink-0 text-xs text-iron-muted tabular-nums">
                  {item.prescription[lang]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {allDone && total > 0 && (
        <CompletionMoment message={t("training.flow.warmupCompleteHint")} />
      )}
    </div>
  );
}
