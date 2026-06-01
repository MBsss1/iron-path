import type { BossDefinition } from "../data/bosses";

type Props = {
  isOpen: boolean;
  boss: BossDefinition | null;
  xpReward: number;
  onClose: () => void;
};

export default function BossDefeatPopup({
  isOpen,
  boss,
  xpReward,
  onClose,
}: Props) {
  if (!isOpen || !boss) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="bg-[#f5ead0] border-4 border-[#b22222] p-6 w-full max-w-sm text-center animate-boss-defeat-pop animate-boss-defeat-glow">
        <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#b22222]">
          Boss Defeated
        </p>

        <h2 className="text-5xl font-black uppercase mt-4 animate-boss-defeat-shake">
          {boss.name}
        </h2>

        <p className="mt-4 uppercase text-sm leading-relaxed">
          {boss.lore}
        </p>

        <div className="mt-6 border-4 border-black bg-black text-[#efe3c2] p-4 space-y-3">
          <div>
            <p className="uppercase text-xs tracking-widest">XP Earned</p>
            <p className="text-3xl font-black text-[#b22222] mt-1">
              +{xpReward}
            </p>
          </div>

          <div className="border-t-2 border-[#efe3c2]/30 pt-3">
            <p className="uppercase text-xs tracking-widest">Title Unlocked</p>
            <p className="text-2xl font-black mt-1">{boss.rewards.title}</p>
          </div>

          <div className="border-t-2 border-[#efe3c2]/30 pt-3">
            <p className="uppercase text-xs tracking-widest">Profile Badge</p>
            <p className="text-lg font-black mt-1 uppercase">
              {boss.rewards.badge.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
        >
          Accept Glory
        </button>
      </div>
    </div>
  );
}
