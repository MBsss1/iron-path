import { SeasonRecord } from "../hooks/useSeasons";

type Props = {
  seasons: SeasonRecord[];
  onBack: () => void;
};

export default function LegacyScreen({ seasons, onBack }: Props) {
  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center flex-1">
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">Legacy</p>
          <h2 className="text-4xl font-black uppercase mt-2 text-iron-text">Completed Seasons</h2>
          <p className="mt-2 uppercase text-sm text-iron-muted">Your recorded seasons and milestones.</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="border border-iron-border-strong px-4 py-2 bg-iron-panel text-iron-cream uppercase text-xs font-black shrink-0 transition-transform active:scale-95"
        >
          Back
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {seasons.length === 0 && (
          <div className="border border-iron-border p-4 iron-card-raised text-center">
            <p className="uppercase font-black text-iron-text">No seasons completed yet.</p>
          </div>
        )}

        {seasons.map((s) => (
          <div key={s.id} className="border border-iron-border p-4 iron-card-panel">
            <div className="flex justify-between">
              <div>
                <p className="uppercase text-xs text-iron-gold">Season {s.id}</p>
                <p className="font-black text-lg mt-1 text-iron-cream">Completed {new Date(s.completedAt).toLocaleDateString()}</p>
              </div>

              <div className="text-right">
                <p className="uppercase text-xs text-iron-gold">Week</p>
                <p className="font-black text-lg mt-1 text-iron-cream">{s.week}</p>
                <p className="uppercase text-xs mt-2 text-iron-gold">Level</p>
                <p className="font-black text-iron-cream">{s.levelAtCompletion ?? "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
