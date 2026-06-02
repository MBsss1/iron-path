import { AVATAR_OPTIONS } from "../data/avatar";

type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  xp: number;
  maxXp: number;
  weight: string;
  goal: string;
  avatarId?: string;
  onBack: () => void;
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
  avatarId,
  onBack,
}: Props) {
  const pathProgress = (week / 24) * 100;
  const xpProgress = (xp / maxXp) * 100;

  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center flex-1">
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

        <button
          type="button"
          onClick={onBack}
          className="border-4 border-black px-4 py-2 bg-black text-[#efe3c2] uppercase text-xs font-black shrink-0 transition-transform active:scale-95"
        >
          Back
        </button>
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
          {AVATAR_OPTIONS.map((option, index) => {
            const unlocked = level >= option.minLevel;
            const isSelected = avatarId === option.id;

            return (
              <div
                key={option.id}
                className={`flex justify-between items-center gap-3 ${
                  index < AVATAR_OPTIONS.length - 1
                    ? "border-b border-black pb-2"
                    : ""
                } ${unlocked ? "" : "opacity-60"}`}
              >
                <span>
                  Level {option.minLevel} — {option.label}
                </span>
                <span className="shrink-0">
                  {unlocked ? (isSelected ? "Equipped" : "Unlocked") : "Locked"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}