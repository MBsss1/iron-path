"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import {
  getWorkoutTimerDisplaySeconds,
  type ActiveTrainingSession,
} from "../utils/activeTrainingSession";
import AnimatedTimerDigits from "./AnimatedTimerDigits";

type Props = {
  session: ActiveTrainingSession;
  onSessionChange: (patch: Partial<ActiveTrainingSession>) => void;
};

const COUNT_UP_CAP = 7200;

export default function TrainingTimer({ session, onSessionChange }: Props) {
  const { t } = useTranslation();
  const [tick, setTick] = useState(0);

  const displaySeconds = getWorkoutTimerDisplaySeconds(session);
  const showHours = displaySeconds >= 3600;
  const progress = Math.min(1, displaySeconds / COUNT_UP_CAP);

  const isRunning = session.workoutTimerIsRunning;
  const isPaused =
    !isRunning &&
    (session.workoutTimerElapsedSeconds > 0 || session.workoutTimerStartedAt !== null);
  const isIdle =
    !isRunning &&
    session.workoutTimerElapsedSeconds === 0 &&
    session.workoutTimerStartedAt === null;

  useEffect(() => {
    if (!session.workoutTimerIsRunning) return;
    const id = setInterval(() => setTick((n) => n + 1), 200);
    return () => clearInterval(id);
  }, [session.workoutTimerIsRunning]);

  const persistRunning = useCallback(() => {
    if (!session.workoutTimerIsRunning || !session.workoutTimerStartedAt) return;
    const segment = Math.floor(
      (Date.now() - session.workoutTimerStartedAt) / 1000
    );
    onSessionChange({
      workoutTimerElapsedSeconds: session.workoutTimerElapsedSeconds + segment,
      workoutTimerStartedAt: null,
      workoutTimerIsRunning: false,
    });
  }, [session, onSessionChange]);

  const handleStart = () => {
    onSessionChange({
      workoutTimerStartedAt: Date.now(),
      workoutTimerIsRunning: true,
    });
  };

  const handlePause = () => {
    persistRunning();
  };

  const handleResume = () => {
    onSessionChange({
      workoutTimerStartedAt: Date.now(),
      workoutTimerIsRunning: true,
    });
  };

  const handleReset = () => {
    onSessionChange({
      workoutTimerElapsedSeconds: 0,
      workoutTimerStartedAt: null,
      workoutTimerIsRunning: false,
    });
  };

  const btnClass =
    "iron-interactive border border-iron-border px-2.5 py-1.5 text-[11px] font-semibold rounded-sm min-h-[36px] bg-iron-raised/80";

  return (
    <div className="training-timer-compact border border-iron-border rounded-sm px-3 py-2.5 bg-iron-panel shadow-[var(--iron-shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-iron-muted">
            {t("training.timer.workoutTime")}
          </p>
          <div className="mt-0.5 text-iron-text">
            <AnimatedTimerDigits
              displaySeconds={displaySeconds}
              showHours={showHours}
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
            />
          </div>
        </div>
        <div
          className="shrink-0 w-10 h-10 rounded-full border border-iron-border relative"
          aria-hidden="true"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="var(--iron-border)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="var(--iron-accent-dim)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={94.25}
              strokeDashoffset={94.25 * (1 - progress)}
              className="training-timer-ring-progress"
            />
          </svg>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {isIdle && (
          <button
            type="button"
            onClick={handleStart}
            className={`${btnClass} iron-btn-primary border-iron-accent text-iron-bg`}
          >
            {t("training.timer.start")}
          </button>
        )}
        {isRunning && (
          <>
            <button type="button" onClick={handlePause} className={btnClass}>
              {t("training.timer.pause")}
            </button>
            <button type="button" onClick={handleReset} className={btnClass}>
              {t("training.timer.reset")}
            </button>
          </>
        )}
        {isPaused && !isIdle && (
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
