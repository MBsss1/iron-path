type Props = {
  isOpen: boolean;
  day: number;
  xpReward: number;
  onClaim: () => void;
};

export default function DailyRewardPopup({
  isOpen,
  day,
  xpReward,
  onClaim,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm animate-modal-pop-in">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-center text-[#b22222]">
          Daily Login Reward
        </p>

        <h2 className="text-3xl font-black uppercase text-center mt-3">
          Day {day}
        </h2>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayNum = i + 1;
            const isCurrent = dayNum === day;
            const isPast = dayNum < day;

            return (
              <div
                key={dayNum}
                className={`border-2 border-black py-2 text-center text-xs font-black ${
                  isCurrent
                    ? "bg-[#b22222] text-[#efe3c2]"
                    : isPast
                      ? "bg-black text-[#efe3c2]"
                      : "bg-[#e8d8b0] text-black"
                }`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center uppercase">
          <p className="text-2xl font-black text-[#b22222] animate-xp-pulse inline-block">
            +{xpReward} XP
          </p>
          <p className="mt-2 text-sm">Check in today to keep your streak</p>
        </div>

        <button
          onClick={onClaim}
          className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
}
