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

export function hapticWorkout() {
  vibrate([20, 50, 30]);
}

export function hapticMission() {
  vibrate(15);
}

export function hapticLevelUp() {
  vibrate([30, 40, 30, 40, 60]);
}

export function hapticAchievement() {
  vibrate([25, 30, 25, 30, 40]);
}

export function hapticTab() {
  vibrate(8);
}
