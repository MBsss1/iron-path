import { AchievementDefinition } from "../data/achievements";

type Props = {
  isOpen: boolean;
  achievement: AchievementDefinition | null;
  onClose: () => void;
};

export default function AchievementPopup({
  isOpen,
  achievement,
  onClose,
}: Props) {
  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-[#b22222]">
          Achievement Unlocked
        </p>

        <h2 className="text-4xl font-black uppercase mt-4">
          {achievement.title}
        </h2>

        <p className="mt-4 uppercase text-sm leading-relaxed">
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
