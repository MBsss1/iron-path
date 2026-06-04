"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { hapticAssessmentTimerDone } from "../utils/haptics";

type TimerStatus = "idle" | "running" | "paused" | "finished";

export type AssessmentTimerProps = {
  durationSeconds?: number;
  countUp?: boolean;
  onComplete?: () => void;
  onStop?: (elapsedSeconds: number) => void;
  label?: string;
};

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const COUNT_UP_RING_CAP = 300;

function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function AssessmentTimer({
  durationSeconds,
  countUp = false,
  onComplete,
  onStop,
  label,
}: AssessmentTimerProps) {
  const { t } = useTranslation();
  const ringGradientId = useId();

  const isCountUp = countUp || durationSeconds === undefined;
  const totalDuration = isCountUp ? COUNT_UP_RING_CAP : (durationSeconds ?? 120);

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [displaySeconds, setDisplaySeconds] = useState(
    isCountUp ? 0 : totalDuration
  );

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
    clearTick();
    elapsedRef.current = 0;
    setStatus("idle");
    setDisplaySeconds(isCountUp ? 0 : totalDuration);
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

  const ringOffset = RING_CIRCUMFERENCE * (1 - progress);
  const dangerPhase =
    !isCountUp && status === "running" && displaySeconds > 0 && displaySeconds <= 10;
  const finishedCountdown = !isCountUp && status === "finished";

  const startLabel = label ?? t("assessment.timer.start");

  const btnClass =
    "iron-interactive border border-iron-border px-3 py-2 text-xs font-semibold rounded-sm min-h-[40px]";

  return (
    <div className="border border-iron-border rounded-sm iron-card-panel p-4 assessment-timer">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg
            className="w-full h-full -rotate-90 assessment-timer-ring"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--iron-accent-dim)" />
                <stop offset="100%" stopColor="var(--iron-accent)" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--iron-border)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke={
                dangerPhase || finishedCountdown
                  ? "var(--iron-danger-muted)"
                  : `url(#${ringGradientId})`
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
              className="assessment-timer-ring-progress"
            />
          </svg>
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              dangerPhase ? "text-iron-danger" : "text-iron-text"
            }`}
            role="timer"
            aria-live="polite"
          >
            <span className="text-3xl font-bold tracking-widest tabular-nums">
              {formatMmSs(displaySeconds)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-iron-muted mt-1">
              {isCountUp ? t("assessment.timer.elapsed") : t("assessment.timer.remaining")}
            </span>
          </div>
        </div>
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
