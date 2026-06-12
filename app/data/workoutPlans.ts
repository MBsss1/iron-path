import { normalizeFitnessGoal } from "./fitnessGoals";

export function getNextMission(goal: string, phase: string) {
  const normalized = normalizeFitnessGoal(goal);

  if (normalized === "running") {
    if (phase === "Foundation") {
      return {
        title: "Runner Foundation",
        exercises: [
          ["Warm-up Walk", "5 min"],
          ["Easy Run", "2 km"],
          ["Mobility", "10 min"],
          ["Plank", "3×30 sec"],
        ],
      };
    }

    if (phase === "Strength") {
      return {
        title: "Runner Strength",
        exercises: [
          ["Intervals", "6×200m"],
          ["Easy Run", "4 km"],
          ["Split Squats", "3×12"],
          ["Plank", "3×60 sec"],
        ],
      };
    }

    return {
      title: "Runner Elite",
      exercises: [
        ["Long Run", "8 km"],
        ["Intervals", "8×400m"],
        ["Mobility", "15 min"],
        ["Core Circuit", "4 rounds"],
      ],
    };
  }

  if (normalized === "weight_loss") {
    return {
      title: "Conditioning Day",
      exercises: [
        ["Push-ups", "4×10"],
        ["Squats", "4×20"],
        ["Mountain Climbers", "4×30 sec"],
        ["Easy Run", "2 km"],
      ],
    };
  }

  if (normalized === "mass_gain" && goal === "athletic") {
    if (phase === "Foundation") {
      return {
        title: "Hybrid Foundation",
        exercises: [
          ["Pull-ups", "3×max"],
          ["Push-ups", "3×15"],
          ["Squats", "3×20"],
          ["Easy Run", "2 km"],
        ],
      };
    }

    if (phase === "Strength") {
      return {
        title: "Hybrid Strength",
        exercises: [
          ["Pull-ups", "5×max"],
          ["Dips", "5×10"],
          ["Bulgarian Squats", "4×12"],
          ["Run", "3 km"],
        ],
      };
    }

    return {
      title: "Hybrid Elite",
      exercises: [
        ["Pull-ups", "6×max"],
        ["Dips", "6×12"],
        ["Pistol Squats", "4×8"],
        ["Run", "5 km"],
      ],
    };
  }

  return {
    title: "Pull Day",
    exercises: [
      ["Pull-ups", "4×max"],
      ["Australian Rows", "4×10-15"],
      ["Backpack Rows", "4×10-15"],
      ["Hanging Knee Raises", "3×12"],
      ["Easy Run", "2 km"],
    ],
  };
}