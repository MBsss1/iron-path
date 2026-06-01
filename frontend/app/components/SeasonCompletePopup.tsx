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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-md text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-[#b22222]">Season Complete</p>
        <h2 className="text-4xl font-black uppercase mt-3">Season Finished</h2>

        <p className="mt-4 uppercase text-sm leading-relaxed">You have completed the 24-week season. Claim your rewards below.</p>

        <div className="mt-6 border-2 border-black p-4 bg-black text-[#efe3c2]">
          <p className="text-xs uppercase">Rewards</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-left">
            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">XP</p>
              <p className="font-black text-lg mt-1">+{rewards.xp}</p>
            </div>

            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Body</p>
              <p className="font-black text-lg mt-1">+{rewards.body}</p>
            </div>

            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Mind</p>
              <p className="font-black text-lg mt-1">+{rewards.mind}</p>
            </div>

            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Work</p>
              <p className="font-black text-lg mt-1">+{rewards.work}</p>
            </div>
          </div>

          {rewards.badge && (
            <div className="mt-4 border-2 border-black p-3 bg-[#efe3c2] text-black text-center">
              <p className="uppercase text-xs">Legacy Badge</p>
              <p className="font-black mt-1">{rewards.badge}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClaim}
            disabled={isClaimed}
            className={`flex-1 border-4 py-3 uppercase font-black ${isClaimed ? "bg-gray-400 text-black border-black" : "bg-[#b22222] text-[#efe3c2] border-black"}`}
          >
            {isClaimed ? "Claimed" : "Claim Rewards"}
          </button>

          {onClose && (
            <button onClick={onClose} className="flex-1 bg-black text-[#efe3c2] border-4 border-[#b22222] py-3 uppercase font-black">
              Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
