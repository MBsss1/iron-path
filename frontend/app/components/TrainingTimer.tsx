"use client";

import { useTranslation } from "../i18n/useTranslation";
import { useTimerEngine } from "../hooks/useTimerEngine";
import TimerRing from "./TimerRing";

export default function TrainingTimer() {
  const { t } = useTranslation();
  const {
    status,
    displaySeconds,
    progress,
    showHours,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  } = useTimerEngine({ mode: "countup", countUpCap: 7200 });

  const btnClass =
    "iron-interactive border border-iron-border px-3 py-2.5 text-xs font-semibold rounded-sm min-h-[44px] bg-iron-raised/80";

  const sublabel =
    status === "running" || status === "paused"
      ? t("training.timer.elapsed")
      : t("training.timer.ready");

  return (
    <div className="training-timer-shell border border-iron-border rounded-sm p-4 sm:p-5 shadow-[var(--iron-shadow-card)] bg-iron-panel">
      <p className="iron-label text-center mb-3">{t("training.timer.title")}</p>
      <div className="flex flex-col items-center">
        <TimerRing
          displaySeconds={displaySeconds}
          progress={progress}
          showHours={showHours}
          size="large"
          sublabel={sublabel}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {status === "idle" && (
          <button
            type="button"
            onClick={handleStart}
            className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
          >
            {t("training.timer.start")}
          </button>
        )}

        {status === "running" && (
          <>
            <button type="button" onClick={handlePause} className={btnClass}>
              {t("training.timer.pause")}
            </button>
            <button type="button" onClick={handleReset} className={btnClass}>
              {t("training.timer.reset")}
            </button>
          </>
        )}

        {status === "paused" && (
          <>
            <button
              type="button"
              onClick={handleResume}
              className={`${btnClass} iron-btn-primary border-iron-accent text-iron-bg`}
            >
              {t("training.timer.resume")}
            </button>
            <button type="button" onClick={handleReset} className={btnClass}>
              {t("training.timer.reset")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
