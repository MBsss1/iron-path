"use client";

import { useState } from "react";

type Props = {
  program: any;
  onCompleteDeepWork: () => void;
  onCompleteProtein: () => void;
  onCompleteSleep: () => void;
};

export default function TodayScreen({
  program,
  onCompleteDeepWork,
  onCompleteProtein,
  onCompleteSleep,
}: Props) {
  const [completed, setCompleted] = useState<string[]>([]);

  const completeTask = (task: string, action: () => void) => {
    if (completed.includes(task)) return;

    action();
    setCompleted([...completed, task]);
  };

  const taskClass = (task: string) =>
    `w-full border-2 border-black p-4 flex justify-between uppercase font-bold cursor-pointer ${
      completed.includes(task)
        ? "bg-[#e8d8b0] text-black opacity-60"
        : "bg-black text-[#efe3c2]"
    }`;

  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-xl mb-24">
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
          <span>+60 XP</span>
        </button>

        {program.workouts?.map((workout: string, index: number) => (
          <div
            key={index}
            className="border-2 border-black p-4 bg-[#e8d8b0] flex justify-between uppercase font-bold"
          >
            <span>{workout}</span>
            <span>+120 XP</span>
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
          <span>+40 XP</span>
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
          <span>+35 XP</span>
        </button>
      </div>
    </div>
  );
}