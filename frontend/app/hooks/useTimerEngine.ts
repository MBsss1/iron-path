"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export type TimerMode = "countup" | "countdown";

type Options = {
  mode: TimerMode;
  durationSeconds?: number;
  countUpCap?: number;
  onComplete?: () => void;
};

export type TimeDigitSlot = {
  kind: "digit";
  id: string;
  value: number;
};

export type TimeSeparatorSlot = {
  kind: "sep";
  id: string;
};

export type TimeSlot = TimeDigitSlot | TimeSeparatorSlot;

/** Stable digit positions so each wheel animates independently (MM:SS or HH:MM:SS). */
export function getTimeSlots(
  totalSeconds: number,
  includeHours: boolean
): TimeSlot[] {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  const showHours = includeHours || hours > 0;

  const slots: TimeSlot[] = [];

  if (showHours) {
    slots.push(
      { kind: "digit", id: "h10", value: Math.floor(hours / 10) % 10 },
      { kind: "digit", id: "h1", value: hours % 10 },
      { kind: "sep", id: "sep-h" }
    );
  }

  slots.push(
    { kind: "digit", id: "m10", value: Math.floor(minutes / 10) % 10 },
    { kind: "digit", id: "m1", value: minutes % 10 },
    { kind: "sep", id: "sep-m" },
    { kind: "digit", id: "s10", value: Math.floor(seconds / 10) % 10 },
    { kind: "digit", id: "s1", value: seconds % 10 }
  );

  return slots;
}

export function formatTimerDisplay(totalSeconds: number, includeHours: boolean): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  if (includeHours || hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function useTimerEngine({
  mode,
  durationSeconds = 60,
  countUpCap = 3600,
  onComplete,
}: Options) {
  const isCountUp = mode === "countup";
  const totalDuration = isCountUp ? countUpCap : durationSeconds;
  const initialDisplay = isCountUp ? 0 : durationSeconds;

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [displaySeconds, setDisplaySeconds] = useState(initialDisplay);

  const elapsedRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
    setDisplaySeconds(isCountUp ? 0 : durationSeconds);
  }, [clearTick, isCountUp, durationSeconds]);

  useEffect(() => () => clearTick(), [clearTick]);

  const handleStart = useCallback(() => {
    if (status === "finished" && !isCountUp) return;
    if (status === "idle") {
      elapsedRef.current = 0;
      setDisplaySeconds(isCountUp ? 0 : durationSeconds);
    }
    setStatus("running");
    startTick();
  }, [status, isCountUp, durationSeconds, startTick]);

  const handlePause = useCallback(() => {
    clearTick();
    setStatus("paused");
  }, [clearTick]);

  const handleResume = useCallback(() => {
    setStatus("running");
    startTick();
  }, [startTick]);

  const handleReset = useCallback(() => {
    resetTimerState();
  }, [resetTimerState]);

  const progress = isCountUp
    ? Math.min(1, displaySeconds / countUpCap)
    : totalDuration > 0
      ? displaySeconds / totalDuration
      : 0;

  const showHours = isCountUp && displaySeconds >= 3600;

  return {
    status,
    displaySeconds,
    progress,
    showHours,
    isCountUp,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    resetTimerState,
  };
}
