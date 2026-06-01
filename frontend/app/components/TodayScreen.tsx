"use client";

import { useMemo, useState } from "react";
import type { ClassId } from "../data/classes";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import { applyClassXpBonus } from "../utils/classBonuses";

type Props = {
  program: any;
  classId?: ClassId | string | null;
  level: number;
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
};

export default function TodayScreen({
  program,
  classId,
  level,
  onCompleteDeepWork,
  onCompleteProtein,
  onCompleteSleep,
}: Props) {
  const [completed, setCompleted] = useState<string[]>([]);

  const deepWorkXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.deepWork, classId, "deepWork", level),
    [classId, level]
  );
  const proteinXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.protein, classId, "mission", level),
    [classId, level]
  );
  const sleepXp = useMemo(
    () => applyClassXpBonus(MISSION_XP.sleep, classId, "mission", level),
    [classId, level]
  );
  const workoutXp = useMemo(
    () =>
      applyClassXpBonus(getWorkoutXp(program.phase), classId, "workout", level),
    [program.phase, classId, level]
  );

  const completeTask = (task: string, action: () => void) => {
    if (completed.includes(task)) return;

    action();
    setCompleted([...completed, task]);
  };

  const taskClass = (task: string) =>
    `w-full border-2 border-black p-4 sm:p-5 flex justify-between uppercase font-bold cursor-pointer min-h-[52px] ${
      completed.includes(task)
        ? "bg-[#e8d8b0] text-black opacity-60"
        : "bg-black text-[#efe3c2]"
    }`;

  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <h2 className="text-4xl font-black uppercase text-center">
        TODAY'S WORK
      </h2>

      <div className="mt-4 text-center uppercase text-sm">
        <p className="font-black">{program.phase}</p>
        <p>Week {program.week} / 24</p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => completeTask("deepWork", onCompleteDeepWork)}
          disabled={completed.includes("deepWork")}
          className={taskClass("deepWork")}
        >
          <span>
            {completed.includes("deepWork")
              ? "✓ Deep Work 2 Hours"
              : "Deep Work 2 Hours"}
          </span>
          <span>+{deepWorkXp} XP</span>
        </button>

        {program.workouts?.map((workout: string, index: number) => (
          <div
            key={index}
            className="border-2 border-black p-4 bg-[#e8d8b0] flex justify-between uppercase font-bold"
          >
            <span>{workout}</span>
            <span>+{workoutXp} XP</span>
          </div>
        ))}

        <button
          onClick={() => completeTask("protein", onCompleteProtein)}
          disabled={completed.includes("protein")}
          className={taskClass("protein")}
        >
          <span>
            {completed.includes("protein")
              ? "✓ Protein Target"
              : "Protein Target"}
          </span>
          <span>+{proteinXp} XP</span>
        </button>

        <button
          onClick={() => completeTask("sleep", onCompleteSleep)}
          disabled={completed.includes("sleep")}
          className={taskClass("sleep")}
        >
          <span>
            {completed.includes("sleep")
              ? "✓ Sleep Before 00:30"
              : "Sleep Before 00:30"}
          </span>
          <span>+{sleepXp} XP</span>
        </button>
      </div>
    </div>
  );
}
