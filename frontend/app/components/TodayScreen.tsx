"use client";

import { useMemo } from "react";
import type { ClassId } from "../data/classes";
import { getWorkoutXp, MISSION_XP } from "../data/xpRewards";
import { applyClassXpBonus } from "../utils/classBonuses";
import type { DailyMission } from "../hooks/useDailyMissions";

type Props = {
  program: any;
  classId?: ClassId | string | null;
  level: number;
  missions: DailyMission[];
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
};

export default function TodayScreen({
  program,
  classId,
  level,
  missions,
  onCompleteDeepWork,
  onCompleteProtein,
  onCompleteSleep,
}: Props) {
  const isCompleted = (id: DailyMission["id"]) =>
    missions.find((mission) => mission.id === id)?.completed ?? false;

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

  const tryComplete = (id: DailyMission["id"], action: () => void) => {
    if (isCompleted(id)) return;
    action();
  };

  const taskClass = (id: DailyMission["id"]) =>
    `w-full border-2 border-black p-4 sm:p-5 flex justify-between uppercase font-bold cursor-pointer min-h-[52px] ${
      isCompleted(id)
        ? "bg-[#e8d8b0] text-black opacity-60"
        : "bg-black text-[#efe3c2]"
    }`;

  const deepWorkDone = isCompleted("deepwork");
  const proteinDone = isCompleted("protein");
  const sleepDone = isCompleted("sleep");
  const workoutDone = isCompleted("workout");

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
          onClick={() => tryComplete("deepwork", onCompleteDeepWork)}
          disabled={deepWorkDone}
          className={taskClass("deepwork")}
        >
          <span>
            {deepWorkDone ? "✓ Deep Work 2 Hours" : "Deep Work 2 Hours"}
          </span>
          <span>+{deepWorkXp} XP</span>
        </button>

        {program.workouts?.map((workout: string, index: number) => (
          <div
            key={index}
            className={`border-2 border-black p-4 bg-[#e8d8b0] flex justify-between uppercase font-bold ${
              workoutDone ? "opacity-60" : ""
            }`}
          >
            <span>
              {workoutDone ? "✓ " : ""}
              {workout}
            </span>
            <span>+{workoutXp} XP</span>
          </div>
        ))}

        <button
          onClick={() => tryComplete("protein", onCompleteProtein)}
          disabled={proteinDone}
          className={taskClass("protein")}
        >
          <span>
            {proteinDone ? "✓ Protein Target" : "Protein Target"}
          </span>
          <span>+{proteinXp} XP</span>
        </button>

        <button
          onClick={() => tryComplete("sleep", onCompleteSleep)}
          disabled={sleepDone}
          className={taskClass("sleep")}
        >
          <span>
            {sleepDone ? "✓ Sleep Before 00:30" : "Sleep Before 00:30"}
          </span>
          <span>+{sleepXp} XP</span>
        </button>
      </div>
    </div>
  );
}
