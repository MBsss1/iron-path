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
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal iron-dossier p-6 w-full max-w-sm text-center animate-modal-enter">
        <p className="iron-label text-iron-danger">Target cleared</p>

        <h2 className="iron-heading text-3xl mt-3">{boss.name}</h2>

        <p className="mt-4 text-sm leading-relaxed text-iron-muted">{boss.lore}</p>

        <div className="mt-6 iron-card-panel p-4 space-y-3 text-left">
          <div>
            <p className="iron-label">XP recorded</p>
            <p className="text-2xl font-semibold iron-text-accent mt-1">+{xpReward}</p>
          </div>

          <div className="border-t border-iron-border pt-3">
            <p className="iron-label">Title earned</p>
            <p className="text-xl font-semibold mt-1">{boss.rewards.title}</p>
          </div>

          <div className="border-t border-iron-border pt-3">
            <p className="iron-label">Profile badge</p>
            <p className="text-base font-semibold mt-1">
              {boss.rewards.badge.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-danger w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          Close dossier
        </button>
      </div>
    </div>
  );
}
