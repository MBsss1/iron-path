import { SeasonRecord } from "../hooks/useSeasons";

type Rewards = {
  xp: number;
  body: number;
  mind: number;
  work: number;
  badge?: string;
};

type Props = {
  isOpen: boolean;
  season?: SeasonRecord | null;
  rewards: Rewards;
  isClaimed?: boolean;
  onClaim: () => void;
  onClose?: () => void;
};

export default function SeasonCompletePopup({ isOpen, season, rewards, isClaimed, onClaim, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="iron-modal border border-iron-gold-dim/40 p-6 w-full max-w-md text-center">
        <p className="iron-label">Season complete</p>
        <h2 className="text-4xl font-black uppercase mt-3 text-iron-text">Season Finished</h2>

        <p className="mt-4 uppercase text-sm leading-relaxed text-iron-muted">You have completed the 24-week season. Claim your rewards below.</p>

        <div className="mt-6 border border-iron-border p-4 iron-card-panel">
          <p className="text-xs uppercase text-iron-gold">Rewards</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-left">
            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs uppercase text-iron-gold">XP</p>
              <p className="font-black text-lg mt-1 text-iron-cream">+{rewards.xp}</p>
            </div>

            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs uppercase text-iron-gold">Body</p>
              <p className="font-black text-lg mt-1 text-iron-cream">+{rewards.body}</p>
            </div>

            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs uppercase text-iron-gold">Mind</p>
              <p className="font-black text-lg mt-1 text-iron-cream">+{rewards.mind}</p>
            </div>

            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs uppercase text-iron-gold">Work</p>
              <p className="font-black text-lg mt-1 text-iron-cream">+{rewards.work}</p>
            </div>
          </div>

          {rewards.badge && (
            <div className="mt-4 border border-iron-border-strong p-3 bg-iron-raised text-iron-text text-center">
              <p className="uppercase text-xs text-iron-gold">Legacy Badge</p>
              <p className="font-black mt-1">{rewards.badge}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClaim}
            disabled={isClaimed}
            className={`flex-1 border py-3 uppercase font-black ${
              isClaimed
                ? "bg-iron-charcoal text-iron-muted border-iron-border"
                : "bg-iron-accent-dim text-iron-bg border-iron-accent"
            }`}
          >
            {isClaimed ? "Claimed" : "Claim Rewards"}
          </button>

          {onClose && (
            <button onClick={onClose} className="flex-1 bg-iron-panel text-iron-cream border border-iron-border-strong py-3 uppercase font-black">
              Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
