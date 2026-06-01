type Props = {
  isOpen: boolean;
  level: number;
  rank: string;
  onClose: () => void;
};

export default function LevelUpPopup({ isOpen, level, rank, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="relative bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm text-center animate-modal-pop-in animate-level-up-shake overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-48 h-48 rounded-full border-4 border-[#b22222]/30 animate-level-up-burst" />
        </div>

        <div className="relative">
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Rank Up</p>

          <h2 className="text-5xl font-black uppercase mt-3">Level {level}</h2>

          <p className="mt-3 uppercase text-xl font-black text-[#b22222]">{rank}</p>

          <p className="mt-6 uppercase text-sm leading-relaxed">
            Your work has been recorded. The path continues.
          </p>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
