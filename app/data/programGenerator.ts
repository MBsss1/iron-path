import { getPhaseByWeek } from "./phases";
import { normalizeFitnessGoal } from "./fitnessGoals";

type Profile = {
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
};

export function generateProgram(profile: Profile | null, week: number) {
  const phase = getPhaseByWeek(week);

  if (!profile) {
    return {
      goal: "mass_gain",
      phase: phase.name,
      week,
      strengthDays: 4,
      runDays: 2,
      focus: phase.focus,
      workouts: ["Push", "Pull + Easy Run", "Legs + Intervals", "Full Body"],
    };
  }

  const goal = normalizeFitnessGoal(profile.goal);

  if (goal === "running") {
    return {
      goal: profile.goal,
      phase: phase.name,
      week,
      strengthDays: 3,
      runDays: 3,
      focus: phase.focus,
      workouts: ["Easy Run", "Intervals", "Strength", "Long Run"],
    };
  }

  if (goal === "weight_loss") {
    return {
      goal: profile.goal,
      phase: phase.name,
      week,
      strengthDays: 3,
      runDays: 3,
      focus: phase.focus,
      workouts: ["Full Body", "Run", "Walk", "Intervals"],
    };
  }

  return {
    goal: profile.goal,
    phase: phase.name,
    week,
    strengthDays: 4,
    runDays: 2,
    focus: phase.focus,
    workouts: ["Push", "Pull + Easy Run", "Legs + Intervals", "Full Body"],
  };
}