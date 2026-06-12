"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { hapticAssessmentTimerDone } from "../utils/haptics";
import TimerRing from "./TimerRing";

type TimerStatus = "idle" | "running" | "paused" | "finished";

export type AssessmentTimerProps = {
  /** Changes reset timer state (e.g. pushups, squats, plank). */
  timerKey?: string;
  durationSeconds?: number;
  countUp?: boolean;
  onComplete?: () => void;
  onStop?: (elapsedSeconds: number) => void;
  label?: string;
};

const COUNT_UP_RING_CAP = 300;

function resolveTimerMode(
  countUp: boolean,
  durationSeconds: number | undefined
): { isCountUp: boolean; totalDuration: number; initialDisplay: number } {
  const isCountUp = countUp || durationSeconds === undefined;
  const totalDuration = isCountUp
    ? COUNT_UP_RING_CAP
    : (durationSeconds ?? 120);
  const initialDisplay = isCountUp ? 0 : totalDuration;
  return { isCountUp, totalDuration, initialDisplay };
}

export default function AssessmentTimer({
  timerKey,
  durationSeconds,
  countUp = false,
  onComplete,
  onStop,
  label,
}: AssessmentTimerProps) {
  const { t } = useTranslation();

  const { isCountUp, totalDuration, initialDisplay } = resolveTimerMode(
    countUp,
    durationSeconds
  );

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [displaySeconds, setDisplaySeconds] = useState(initialDisplay);

  const elapsedRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStopRef.current = onStop;
  }, [onComplete, onStop]);

  const clearTick = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const finishCountdown = useCallback(() => {
    clearTick();
    setDisplaySeconds(0);
    setStatus("finished");
    hapticAssessmentTimerDone();
    onCompleteRef.current?.();
  }, [clearTick]);

  const syncDisplay = useCallback(
    (elapsed: number) => {
      if (isCountUp) {
        setDisplaySeconds(elapsed);
        return;
      }
      const remaining = Math.max(0, totalDuration - elapsed);
      setDisplaySeconds(remaining);
      if (remaining <= 0) {
        finishCountdown();
      }
    },
    [isCountUp, totalDuration, finishCountdown]
  );

  const startTick = useCallback(() => {
    clearTick();
    const startedAt = Date.now() - elapsedRef.current * 1000;

    tickRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      elapsedRef.current = elapsed;
      syncDisplay(elapsed);
    }, 200);
  }, [clearTick, syncDisplay]);

  const resetTimerState = useCallback(() => {
    clearTick();
    elapsedRef.current = 0;
    setStatus("idle");
    const mode = resolveTimerMode(countUp, durationSeconds);
    setDisplaySeconds(mode.initialDisplay);
  }, [clearTick, countUp, durationSeconds]);

  useEffect(() => {
    resetTimerState();
  }, [timerKey, durationSeconds, countUp, resetTimerState]);

  useEffect(() => () => clearTick(), [clearTick]);

  const handleStart = () => {
    if (status === "finished" && !isCountUp) return;
    if (status === "idle") {
      elapsedRef.current = 0;
      if (!isCountUp) {
        setDisplaySeconds(totalDuration);
      } else {
        setDisplaySeconds(0);
      }
    }
    setStatus("running");
    startTick();
  };

  const handlePause = () => {
    clearTick();
    setStatus("paused");
  };

  const handleResume = () => {
    setStatus("running");
    startTick();
  };

  const handleReset = () => {
    resetTimerState();
  };

  const handleStop = () => {
    clearTick();
    const elapsed = elapsedRef.current;
    setStatus("idle");
    setDisplaySeconds(isCountUp ? elapsed : totalDuration);
    onStopRef.current?.(elapsed);
  };

  const progress = isCountUp
    ? Math.min(1, displaySeconds / COUNT_UP_RING_CAP)
    : totalDuration > 0
      ? displaySeconds / totalDuration
      : 0;

  const showHours = displaySeconds >= 3600;
  const dangerPhase =
    !isCountUp && status === "running" && displaySeconds > 0 && displaySeconds <= 10;
  const finishedCountdown = !isCountUp && status === "finished";

  const startLabel = label ?? t("assessment.timer.start");

  const btnClass =
    "iron-interactive border border-iron-border px-3 py-2 text-xs font-semibold rounded-sm min-h-[40px]";

  const sublabel = isCountUp
    ? t("assessment.timer.elapsed")
    : t("assessment.timer.remaining");

  return (
    <div className="border border-iron-border rounded-sm iron-card-panel p-4 assessment-timer">
      <div className="flex flex-col items-center">
        <TimerRing
          displaySeconds={displaySeconds}
          progress={progress}
          showHours={showHours}
          size="large"
          dangerPhase={dangerPhase}
          finished={finishedCountdown}
          sublabel={sublabel}
        />
      </div>

      {finishedCountdown && (
        <p className="mt-4 text-sm text-center text-iron-accent leading-relaxed">
          {t("assessment.timer.testComplete")}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {status === "idle" && (
          <button
            type="button"
            onClick={handleStart}
            className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
          >
            {startLabel}
          </button>
        )}

        {status === "running" && (
          <>
            <button type="button" onClick={handlePause} className={btnClass}>
              {t("assessment.timer.pause")}
            </button>
            <button type="button" onClick={handleReset} className={btnClass}>
              {t("assessment.timer.reset")}
            </button>
            {isCountUp && (
              <button
                type="button"
                onClick={handleStop}
                className={`${btnClass} col-span-2 iron-btn-primary border-iron-accent text-iron-bg`}
              >
                {t("assessment.timer.stop")}
              </button>
            )}
          </>
        )}

        {status === "paused" && (
          <>
            <button
              type="button"
              onClick={handleResume}
              className={`${btnClass} iron-btn-primary border-iron-accent text-iron-bg`}
            >
              {t("assessment.timer.resume")}
            </button>
            <button type="button" onClick={handleReset} className={btnClass}>
              {t("assessment.timer.reset")}
            </button>
            {isCountUp && (
              <button
                type="button"
                onClick={handleStop}
                className={`${btnClass} col-span-2 border-iron-accent-dim/60`}
              >
                {t("assessment.timer.stop")}
              </button>
            )}
          </>
        )}

        {finishedCountdown && (
          <button
            type="button"
            onClick={handleReset}
            className={`${btnClass} col-span-2`}
          >
            {t("assessment.timer.reset")}
          </button>
        )}
      </div>
    </div>
  );
}
