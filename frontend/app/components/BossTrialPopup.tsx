import { BossTrial } from "../data/bossTrials";

type Props = {
  isOpen: boolean;
  trial: BossTrial | null;
  onComplete: () => void;
  onSkip?: () => void;
};

export default function BossTrialPopup({
  isOpen,
  trial,
  onComplete,
  onSkip,
}: Props) {
  if (!isOpen || !trial) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="text-center border-b-4 border-black pb-4 mb-4">
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-[#b22222]">
            Boss Trial
          </p>

          <h2 className="text-4xl font-black uppercase mt-2">{trial.title}</h2>

          <p className="mt-3 uppercase text-sm leading-relaxed">
            {trial.description}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-black uppercase mb-3">Requirements</h3>

          <div className="space-y-2 border-2 border-black p-3 bg-black text-[#efe3c2]">
            {trial.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-black">•</span>
                <p className="text-sm uppercase font-bold">{req}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 border-2 border-black p-4 bg-[#e8d8b0] text-center">
          <p className="uppercase text-xs font-bold tracking-widest">
            Reward
          </p>

          <p className="text-4xl font-black text-[#b22222] mt-2">
            +{trial.xpReward} XP
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onComplete}
            className="flex-1 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black"
          >
            Accept Trial
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 bg-black text-[#efe3c2] border-4 border-[#b22222] py-3 uppercase font-black"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
