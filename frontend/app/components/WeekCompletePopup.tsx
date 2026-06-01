type Props = {
  isOpen: boolean;
  week: number;
  phase: string;
  onClose: () => void;
};

export default function WeekCompletePopup({
  isOpen,
  week,
  phase,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ead0] border-4 border-black p-6 w-full max-w-sm text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Week Complete
        </p>

        <h2 className="text-5xl font-black uppercase mt-3">
          Week {week}
        </h2>

        <p className="mt-3 uppercase text-xl font-black text-[#b22222]">
          {phase}
        </p>

        <p className="mt-6 uppercase text-sm leading-relaxed">
          Another week of work is recorded. The path continues.
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