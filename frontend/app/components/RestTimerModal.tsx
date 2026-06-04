"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { useTimerEngine } from "../hooks/useTimerEngine";
import TimerRing from "./TimerRing";
import { hapticRestTimerDone } from "../utils/haptics";

type Props = {
  isOpen: boolean;
  durationSeconds: number;
  exerciseName: string;
  onClose: () => void;
};

export default function RestTimerModal({
  isOpen,
  durationSeconds,
  exerciseName,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [showComplete, setShowComplete] = useState(false);

  const {
    status,
    displaySeconds,
    progress,
    showHours,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    resetTimerState,
  } = useTimerEngine({
    mode: "countdown",
    durationSeconds,
    onComplete: () => {
      hapticRestTimerDone();
      setShowComplete(true);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      resetTimerState();
      setShowComplete(false);
    }
  }, [isOpen, resetTimerState]);

  if (!isOpen) return null;

  const btnClass =
    "iron-interactive border border-iron-border px-3 py-2 text-xs font-semibold rounded-sm min-h-[40px] bg-iron-raised/80";

  const dangerPhase = status === "running" && displaySeconds > 0 && displaySeconds <= 10;

  return (
    <div
      className="fixed inset-0 iron-modal-overlay flex items-end sm:items-center justify-center z-50 p-4 animate-overlay-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-timer-title"
      onClick={onClose}
    >
      <div
        className={`iron-modal p-5 w-full max-w-sm rounded-sm animate-modal-enter ${
          showComplete ? "rest-timer-complete" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="iron-label text-iron-accent">{t("training.restTimer.title")}</p>
        <p id="rest-timer-title" className="text-sm text-iron-muted mt-1 truncate">
          {exerciseName}
        </p>

        <div className="mt-4 flex flex-col items-center">
          <TimerRing
            displaySeconds={displaySeconds}
            progress={progress}
            showHours={showHours}
            size="compact"
            dangerPhase={dangerPhase}
            finished={status === "finished"}
            sublabel={t("training.restTimer.remaining")}
          />
        </div>

        {showComplete && (
          <p className="mt-3 text-sm text-center text-iron-accent font-medium">
            {t("training.restTimer.complete")}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {status === "idle" && (
            <button
              type="button"
              onClick={handleStart}
              className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
            >
              {t("training.restTimer.start")}
            </button>
          )}

          {status === "running" && (
            <>
              <button type="button" onClick={handlePause} className={btnClass}>
                {t("training.restTimer.pause")}
              </button>
              <button type="button" onClick={handleReset} className={btnClass}>
                {t("training.restTimer.reset")}
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
                {t("training.restTimer.resume")}
              </button>
              <button type="button" onClick={handleReset} className={btnClass}>
                {t("training.restTimer.reset")}
              </button>
            </>
          )}

          {status === "finished" && (
            <button
              type="button"
              onClick={handleReset}
              className={`${btnClass} col-span-2`}
            >
              {t("training.restTimer.reset")}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive w-full mt-3 py-2.5 text-xs font-semibold text-iron-muted border border-iron-border rounded-sm"
        >
          {t("training.restTimer.close")}
        </button>
      </div>
    </div>
  );
}
