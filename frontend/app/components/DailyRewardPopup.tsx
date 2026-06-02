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
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm animate-modal-enter">
        <p className="iron-label text-center">Daily check-in</p>

        <h2 className="iron-heading text-3xl text-center mt-3">Day {day}</h2>

        <div className="mt-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayNum = i + 1;
            const isCurrent = dayNum === day;
            const isPast = dayNum < day;

            return (
              <div
                key={dayNum}
                className={`border py-2 text-center text-xs font-semibold rounded-sm ${
                  isCurrent
                    ? "border-iron-accent-dim bg-iron-accent/15 text-iron-text"
                    : isPast
                      ? "border-iron-border bg-iron-panel text-iron-muted"
                      : "border-iron-border bg-iron-charcoal text-iron-muted"
                }`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-2xl font-semibold iron-text-accent">+{xpReward} XP</p>
          <p className="mt-2 text-sm text-iron-muted">Check in today to keep your streak</p>
        </div>

        <button
          type="button"
          onClick={onClaim}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          Record check-in
        </button>
      </div>
    </div>
  );
}
