type Props = {
  isOpen: boolean;
  xpReward: number;
  onClose: () => void;
};

export default function WorkoutPopup({
  isOpen,
  xpReward,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm animate-modal-pop-in">
        <h2 className="text-3xl font-black uppercase text-center">
          Workout Completed
        </h2>

        <div className="mt-6 text-center uppercase">
          <p className="text-2xl font-black text-[#b22222] animate-xp-pulse inline-block">
            +{xpReward} XP
          </p>

          <p className="mt-2">+1 Body</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
