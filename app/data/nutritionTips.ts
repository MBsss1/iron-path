import { normalizeFitnessGoal } from "./fitnessGoals";

export const NUTRITION_TIPS: Record<string, string[]> = {
  mass_gain: [
    "Hit protein at every meal — meat, eggs, dairy, or legumes.",
    "Add rice, oats, or potatoes around training for extra fuel.",
    "Keep a bedtime snack ready: yogurt, cottage cheese, or a shake.",
    "Prep one extra meal ahead so you never miss calories late in the day.",
  ],
  weight_loss: [
    "Build plates around lean protein and vegetables first.",
    "Drink water through the day — no need for extreme restriction.",
    "Steady habits beat crash diets for lasting change.",
    "Eat slowly; stop at satisfied, not stuffed.",
  ],
  running: [
    "Carbs around activity support pace — whole foods, not fear of food.",
    "Hydrate through the day, not only before a run.",
    "Protein after sessions helps legs recover and adapt.",
    "Sleep and water matter as much as mileage.",
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
  const key = normalizeFitnessGoal(goal);
  return NUTRITION_TIPS[key] ?? DEFAULT_TIPS;
}
