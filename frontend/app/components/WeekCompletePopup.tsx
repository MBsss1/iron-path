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
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm text-center animate-modal-pop-in border border-iron-gold-dim/40">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
          Week Complete
        </p>

        <h2 className="text-5xl font-black uppercase mt-3 text-iron-text">
          Week {week}
        </h2>

        <p className="mt-3 text-xl font-semibold iron-text-accent">
          {phase}
        </p>

        <p className="mt-6 uppercase text-sm leading-relaxed text-iron-muted normal-case">
          Another week of work is recorded. The path continues.
        </p>

        <button
          onClick={onClose}
          className="w-full mt-6 iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
