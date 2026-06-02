type Props = { week: number };

export default function SeasonProgress({ week }: Props) {
  const pct = Math.min(100, Math.round((week / 24) * 100));

  return (
    <div className="mt-4 iron-card-raised p-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black uppercase text-iron-gold">Season Progress</h4>
        <p className="text-sm font-bold uppercase text-iron-muted">{pct}%</p>
      </div>

      <div className="w-full h-4 iron-progress-track mt-3 overflow-hidden rounded-sm">
        <div
          className="h-full iron-progress-fill transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
