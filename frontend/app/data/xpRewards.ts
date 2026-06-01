export function getWorkoutXp(phase: string) {
  if (phase === "Foundation") return 100;

  if (phase === "Building") return 120;

  if (phase === "Strength") return 150;

  if (phase === "Hypertrophy") return 170;

  if (phase === "Athlete") return 200;

  return 250;
}