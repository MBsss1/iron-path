type Props = {
  isOpen: boolean;
  level: number;
  rank: string;
  onClose: () => void;
};

export default function LevelUpPopup({ isOpen, level, rank, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm text-center animate-modal-enter border border-iron-border-strong">
        <p className="iron-label">Rank advancement</p>

        <h2 className="iron-heading text-5xl mt-3">Level {level}</h2>

        <p className="mt-3 text-xl font-semibold iron-text-accent">{rank}</p>

        <p className="mt-6 text-sm leading-relaxed text-iron-muted">
          Your work has been recorded. The path continues.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
