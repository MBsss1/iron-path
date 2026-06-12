export function getPhaseByWeek(week: number) {
  if (week <= 4) {
    return {
      name: "Foundation",
      focus: "Build discipline, joints, technique and base strength",
    };
  }

  if (week <= 8) {
    return {
      name: "Building",
      focus: "Increase volume, reps and weekly consistency",
    };
  }

  if (week <= 12) {
    return {
      name: "Strength",
      focus: "Increase power and compound movement performance",
    };
  }

  if (week <= 16) {
    return {
      name: "Hypertrophy",
      focus: "Push muscle growth with harder variations",
    };
  }

  if (week <= 20) {
    return {
      name: "Athlete",
      focus: "Improve endurance, speed and work capacity",
    };
  }

  return {
    name: "Final Form",
    focus: "Peak performance and complete transformation",
  };
}