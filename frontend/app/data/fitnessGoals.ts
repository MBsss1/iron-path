/** Active goals shown in onboarding / profile. */
export type ActiveFitnessGoal = "mass_gain" | "weight_loss" | "running";

/** Legacy profile.goal values kept for storage compatibility. */
export type LegacyFitnessGoal = "fat_loss" | "runner" | "athletic";

export type FitnessGoal = ActiveFitnessGoal | LegacyFitnessGoal;

export const ACTIVE_FITNESS_GOALS: ActiveFitnessGoal[] = [
  "mass_gain",
  "weight_loss",
  "running",
];

const ACTIVE_SET = new Set<string>(ACTIVE_FITNESS_GOALS);
const LEGACY_SET = new Set<string>(["fat_loss", "runner", "athletic"]);

export function isActiveFitnessGoal(goal: string): goal is ActiveFitnessGoal {
  return ACTIVE_SET.has(goal);
}

export function isLegacyFitnessGoal(goal: string | undefined): boolean {
  return goal === "athletic" || goal === "fat_loss" || goal === "runner";
}

/** Maps legacy + unknown to generator/nutrition logic. athletic → mass_gain (safe default). */
export function normalizeFitnessGoal(goal: string | undefined): ActiveFitnessGoal {
  switch (goal) {
    case "mass_gain":
      return "mass_gain";
    case "weight_loss":
    case "fat_loss":
      return "weight_loss";
    case "running":
    case "runner":
      return "running";
    case "athletic":
      return "mass_gain";
    default:
      return "mass_gain";
  }
}

/** i18n key for short goal label (athletic shows legacy label only). */
export function goalDisplayI18nKey(goal: string | undefined): string {
  if (!goal) return "goal.general";
  if (goal === "athletic") return "goal.athletic_legacy";
  return `goal.${normalizeFitnessGoal(goal)}.title`;
}

/** Parse stored profile goal; keeps legacy strings as-is for storage. */
export function parseProfileGoal(goal: string | undefined): FitnessGoal {
  if (goal && (ACTIVE_SET.has(goal) || LEGACY_SET.has(goal))) {
    return goal as FitnessGoal;
  }
  return "mass_gain";
}

/** Value to persist when user picks an active goal in UI. */
export function coerceToActiveGoal(goal: string): ActiveFitnessGoal {
  return normalizeFitnessGoal(goal);
}
