type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  xp: number;
  maxXp: number;
  weight: string;
  goal: string;
};

export default function ProgressScreen({
  level,
  rank,
  week,
  phase,
  xp,
  maxXp,
  weight,
  goal,
}: Props) {
  const pathProgress = (week / 24) * 100;
  const xpProgress = (xp / maxXp) * 100;

  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Iron Record
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          Progress
        </h2>

        <p className="mt-2 uppercase text-sm">
          Proof of work. Proof of growth.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="border-2 border-black p-4 bg-black text-[#efe3c2] text-center">
          <p className="uppercase text-xs font-bold">Level</p>
          <p className="text-4xl font-black">{level}</p>
          <p className="uppercase text-xs mt-1">{rank}</p>
        </div>

        <div className="border-2 border-black p-4 bg-black text-[#efe3c2] text-center">
          <p className="uppercase text-xs font-bold">Week</p>
          <p className="text-4xl font-black">{week}</p>
          <p className="uppercase text-xs mt-1">/ 24</p>
        </div>
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
        <div className="flex justify-between uppercase text-sm font-black">
          <span>24 Week Path</span>
          <span>{Math.round(pathProgress)}%</span>
        </div>

        <div className="w-full h-4 border-2 border-black mt-2 bg-[#f5ead0]">
          <div
            className="h-full bg-[#b22222]"
            style={{ width: `${pathProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
        <div className="flex justify-between uppercase text-sm font-black">
          <span>XP Progress</span>
          <span>
            {xp} / {maxXp}
          </span>
        </div>

        <div className="w-full h-4 border-2 border-black mt-2 bg-[#f5ead0]">
          <div
            className="h-full bg-[#b22222]"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-black text-[#efe3c2]">
        <div className="flex justify-between uppercase text-sm">
          <span>Current Phase</span>
          <span>{phase}</span>
        </div>

        <div className="flex justify-between uppercase text-sm mt-3">
          <span>Goal</span>
          <span>{goal.replace("_", " ")}</span>
        </div>

        <div className="flex justify-between uppercase text-sm mt-3">
          <span>Weight</span>
          <span>{weight} KG</span>
        </div>
      </div>

      <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
        <h3 className="text-xl font-black uppercase">
          Avatar Evolution
        </h3>

        <div className="mt-4 space-y-3 uppercase text-sm font-bold">
          <div className="flex justify-between border-b border-black pb-2">
            <span>Level 1</span>
            <span>Awakening</span>
          </div>

          <div className="flex justify-between border-b border-black pb-2">
            <span>Level 5</span>
            <span>Disciplined</span>
          </div>

          <div className="flex justify-between">
            <span>Level 10</span>
            <span>Street Athlete</span>
          </div>
        </div>
      </div>
    </div>
  );
}