import { getNextMission } from "../data/workoutPlans";
import { getWorkoutXp } from "../data/xpRewards";
type Props = {
  onCompleteWorkout: () => void;
  onCompleteWeek: () => void;
  program: any;
};

export default function TrainingScreen({
  onCompleteWorkout,
  onCompleteWeek,
  program,
}: Props) {
  const mission = getNextMission(
  program.goal,
  program.phase
);
const workoutXp = getWorkoutXp(program.phase);

  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Current Phase
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          {program.phase}
        </h2>

        <p className="mt-2 uppercase text-sm">
          Week {program.week} / 24
        </p>
        

        <p className="mt-4 uppercase text-sm font-bold">
          {program.focus}
        </p>
      </div>

      <div className="mt-8 border-2 border-black p-4 bg-[#e8d8b0]">
        <h3 className="text-2xl font-black uppercase">
          This Week
        </h3>
<div className="mt-4 space-y-3 text-sm uppercase font-bold">
  {program.workouts?.map((workout: string, index: number) => (
    <div
      key={index}
      className="flex justify-between border-b border-black pb-2"
    >
      <span>{workout}</span>
      <span>+120 XP</span>
    </div>
  ))}

  <div className="flex justify-between pt-2">
    <span>Strength Days</span>
    <span>{program.strengthDays}</span>
  </div>

  <div className="flex justify-between">
    <span>Run Days</span>
    <span>{program.runDays}</span>
  </div>
</div>
</div>

      <div className="mt-6 border-2 border-black p-4 bg-black text-[#efe3c2]">
        <p className="uppercase text-sm tracking-[0.2em]">
          Next Mission
        </p>

        <h3 className="text-3xl font-black mt-2 uppercase">
          {mission.title}
        </h3>
        <div className="mt-3 border-2 border-[#efe3c2] px-3 py-2 inline-block">
  <p className="uppercase text-xs tracking-widest">
    Mission Reward
  </p>
  <p className="text-xl font-black text-[#b22222]">
    +{workoutXp} XP
  </p>
</div>

        <div className="mt-4 space-y-3 text-sm uppercase">
          {mission.exercises.map(([name, value]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onCompleteWorkout}
        className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-4 uppercase font-black tracking-widest"
      >
        Complete Workout
      </button>
<button
  onClick={() => {
    console.log("COMPLETE WEEK CLICKED");
    onCompleteWeek();
  }}
  className="w-full mt-4 bg-black text-[#efe3c2] border-4 border-[#b22222] py-4 uppercase font-black tracking-widest"
>
  Complete Week
</button>
    </div>
  );
}