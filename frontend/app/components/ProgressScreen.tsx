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
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24 iron-stagger space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center flex-1">
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Iron Record
          </p>

          <h2 className="text-4xl font-black uppercase mt-2 text-iron-text">
            Progress
          </h2>

          <p className="mt-2 uppercase text-sm text-iron-muted">
            Proof of work. Proof of growth.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="iron-interactive border border-iron-border-strong px-4 py-2 iron-card-panel uppercase text-xs font-black shrink-0 hover:border-iron-gold-dim"
        >
          Back
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">Level</p>
          <p className="text-4xl font-black text-iron-text">{level}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">{rank}</p>
        </div>

        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">Week</p>
          <p className="text-4xl font-black text-iron-text">{week}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">/ 24</p>
        </div>
      </div>

      <div className="mt-6 iron-card-raised p-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>24 Week Path</span>
          <span className="text-iron-gold">{Math.round(pathProgress)}%</span>
        </div>

        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${pathProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 iron-card-raised p-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>XP Progress</span>
          <span className="text-iron-muted">
            {xp} / {maxXp}
          </span>
        </div>

        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 iron-card-panel p-4 space-y-3">
        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">Current Phase</span>
          <span>{phase}</span>
        </div>

        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">Goal</span>
          <span>{goal.replace("_", " ")}</span>
        </div>

        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">Weight</span>
          <span>{weight} KG</span>
        </div>
      </div>

      <div className="mt-6 iron-card-raised p-4">
        <h3 className="text-xl font-black uppercase text-iron-gold">
          Avatar Evolution
        </h3>

        <div className="mt-4 space-y-3 uppercase text-sm font-bold">
          {AVATAR_OPTIONS.map((option, index) => {
            const unlocked = level >= option.minLevel;
            const isSelected = avatarId === option.id;

            return (
              <div
                key={option.id}
                className={`flex justify-between items-center gap-3 text-iron-text ${
                  index < AVATAR_OPTIONS.length - 1
                    ? "border-b border-iron-border pb-2"
                    : ""
                } ${unlocked ? "" : "opacity-50"}`}
              >
                <span>
                  Level {option.minLevel} — {option.label}
                </span>
                <span className={`shrink-0 ${isSelected ? "text-iron-gold" : "text-iron-muted"}`}>
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
