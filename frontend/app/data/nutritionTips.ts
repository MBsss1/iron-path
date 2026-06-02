export const NUTRITION_TIPS: Record<string, string[]> = {
  mass_gain: [
    "Hit protein at every meal — meat, eggs, dairy, or legumes.",
    "Add rice, oats, or potatoes around training for extra fuel.",
    "Keep a bedtime snack ready: yogurt, cottage cheese, or a shake.",
    "Prep one extra meal ahead so you never miss calories late in the day.",
  ],
  fat_loss: [
    "Build plates around lean protein and vegetables first.",
    "Drink water before meals to stay full with fewer calories.",
    "Keep junk food out of sight — discipline starts at the grocery list.",
    "Eat slowly; stop at satisfied, not stuffed.",
  ],
  runner: [
    "Carbs around runs support pace and recovery — don't fear rice or fruit.",
    "Hydrate through the day, not only right before a session.",
    "Protein after runs helps repair legs and keep pace next week.",
    "Salt whole foods lightly on long-run days if you sweat heavily.",
  ],
  athletic: [
    "Balance protein, carbs, and fats across the day for steady energy.",
    "Time a solid meal 2–3 hours before hard training when possible.",
    "Recovery nutrition matters: protein + carbs within a few hours after work.",
    "Sleep and food work together — protect both like training blocks.",
  ],
};

const DEFAULT_TIPS = [
  "Eat protein at each meal to support recovery.",
  "Drink water steadily through the day.",
  "Plan meals ahead so discipline is easier than willpower.",
  "Whole foods beat shortcuts for long-term progress.",
];

export function getNutritionTips(goal?: string): string[] {
  if (!goal) return DEFAULT_TIPS;
  return NUTRITION_TIPS[goal] ?? DEFAULT_TIPS;
}

export function getNutritionGoalLabel(goal?: string): string {
  switch (goal) {
    case "mass_gain":
      return "Mass Gain";
    case "fat_loss":
      return "Fat Loss";
    case "runner":
      return "Runner";
    case "athletic":
      return "Athletic";
    default:
      return "General";
  }
}
