"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import {
  getRestTimerDisplaySeconds,
  type RestTimerSessionState,
} from "../utils/activeTrainingSession";
import { formatTimerDisplay } from "../hooks/useTimerEngine";
import TimerRing from "./TimerRing";
import { hapticRestTimerDone } from "../utils/haptics";

type Props = {
  state: RestTimerSessionState | null;
  onStateChange: (state: RestTimerSessionState | null) => void;
};

function syncElapsed(state: RestTimerSessionState): RestTimerSessionState {
  if (!state.isRunning || !state.startedAt) return state;
  const segment = Math.floor((Date.now() - state.startedAt) / 1000);
  const elapsed = state.elapsedSeconds + segment;
  const finished = elapsed >= state.durationSeconds;
  return {
    ...state,
    elapsedSeconds: Math.min(state.durationSeconds, elapsed),
    startedAt: null,
    isRunning: false,
    isFinished: finished || state.isFinished,
  };
}

export default function RestTimerPanel({ state, onStateChange }: Props) {
  const { t } = useTranslation();
  const [, setTick] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const isOpen = state !== null;
  const displaySeconds = state ? getRestTimerDisplaySeconds(state) : 0;
  const progress =
    state && state.durationSeconds > 0
      ? displaySeconds / state.durationSeconds
      : 0;
  const showComplete = state?.isFinished ?? false;

  useEffect(() => {
    if (!state?.isRunning) return;
    const id = setInterval(() => {
      setTick((n) => n + 1);
      const current = stateRef.current;
      if (!current) return;
      const remaining = getRestTimerDisplaySeconds(current);
      if (remaining <= 0) {
        hapticRestTimerDone();
        onStateChange({
          ...syncElapsed(current),
          isFinished: true,
        });
      }
    }, 200);
    return () => clearInterval(id);
  }, [state?.isRunning, onStateChange]);

  const persistRunning = useCallback(() => {
    if (!state?.isRunning) return;
    onStateChange(syncElapsed(state));
  }, [state, onStateChange]);

  if (!isOpen || !state) return null;

  const handleStart = () => {
    onStateChange({
      ...state,
      startedAt: Date.now(),
      isRunning: true,
      isFinished: false,
    });
  };

  const handlePause = () => persistRunning();

  const handleResume = () => {
    onStateChange({
      ...state,
      startedAt: Date.now(),
      isRunning: true,
    });
  };

  const handleReset = () => {
    onStateChange({
      ...state,
      elapsedSeconds: 0,
      startedAt: null,
      isRunning: false,
      isFinished: false,
    });
  };

  const btnClass =
    "iron-interactive border border-iron-border px-2 py-1.5 text-[11px] font-semibold rounded-sm min-h-[36px] bg-iron-raised/80";

  const dangerPhase =
    state.isRunning && displaySeconds > 0 && displaySeconds <= 10;

  return (
    <div
      className="fixed left-0 right-0 z-40 px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pointer-events-none"
      style={{ bottom: 0 }}
    >
      <div
        className={`pointer-events-auto mx-auto max-w-lg border border-iron-border rounded-sm bg-iron-panel shadow-[var(--iron-shadow-modal)] p-4 ${
          showComplete ? "rest-timer-complete" : ""
        }`}
        role="region"
        aria-label={t("training.restTimer.title")}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="iron-label text-iron-accent text-[10px]">
              {t("training.restTimer.title")}
            </p>
            <p className="text-sm font-medium text-iron-text truncate mt-0.5">
              {state.exerciseName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStateChange(null)}
            className="iron-interactive text-iron-muted text-xs px-2 py-1 shrink-0"
            aria-label={t("training.restTimer.close")}
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <TimerRing
            displaySeconds={displaySeconds}
            progress={progress}
            showHours={false}
            size="compact"
            dangerPhase={dangerPhase}
            finished={showComplete}
          />
          <div className="flex-1 grid grid-cols-2 gap-1.5">
            {!state.isRunning && !state.isFinished && state.elapsedSeconds === 0 && (
              <button
                type="button"
                onClick={handleStart}
                className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
              >
                {t("training.restTimer.start")}
              </button>
            )}
            {state.isRunning && (
              <>
                <button type="button" onClick={handlePause} className={btnClass}>
                  {t("training.restTimer.pause")}
                </button>
                <button type="button" onClick={handleReset} className={btnClass}>
                  {t("training.restTimer.reset")}
                </button>
              </>
            )}
            {!state.isRunning &&
              (state.elapsedSeconds > 0 || state.startedAt) &&
              !state.isFinished && (
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
            {showComplete && (
              <button
                type="button"
                onClick={() => onStateChange(null)}
                className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
              >
                {t("training.restTimer.close")}
              </button>
            )}
          </div>
        </div>

        {showComplete && (
          <p className="mt-2 text-sm text-center text-iron-accent font-medium">
            {t("training.restTimer.complete")}
          </p>
        )}
      </div>
    </div>
  );
}
