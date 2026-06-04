import {
  getTelegramWebApp,
  isTelegramWebApp,
  telegramHapticImpact,
  telegramHapticNotification,
} from "./telegram";

type HapticPattern = number | number[];

function vibrate(pattern: HapticPattern) {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Vibration API unavailable or blocked
  }
}

function tryTelegramHaptic(telegramFn: () => void): boolean {
  if (!isTelegramWebApp()) return false;

  try {
    telegramFn();
    return Boolean(getTelegramWebApp()?.HapticFeedback);
  } catch {
    return false;
  }
}

function hapticWithFallback(telegramFn: () => void, pattern: HapticPattern) {
  if (tryTelegramHaptic(telegramFn)) return;
  vibrate(pattern);
}

export function hapticWorkout() {
  hapticWithFallback(() => telegramHapticImpact("heavy"), [20, 50, 30]);
}

export function hapticMission() {
  hapticWithFallback(() => telegramHapticImpact("medium"), 15);
}

export function hapticLevelUp() {
  hapticWithFallback(() => telegramHapticNotification("success"), [
    30, 40, 30, 40, 60,
  ]);
}

export function hapticAchievement() {
  hapticWithFallback(() => telegramHapticNotification("success"), [
    25, 30, 25, 30, 40,
  ]);
}

export function hapticBossDefeat() {
  hapticWithFallback(() => telegramHapticImpact("heavy"), [
    40, 60, 30, 60, 30, 80, 100,
  ]);
}

export function hapticTab() {
  hapticWithFallback(() => telegramHapticImpact("light"), 8);
}

export function hapticAssessmentTimerDone() {
  hapticWithFallback(() => telegramHapticNotification("success"), [20, 30, 20]);
}

export function hapticRestTimerDone() {
  hapticWithFallback(() => telegramHapticNotification("success"), [15, 25, 15]);
}
