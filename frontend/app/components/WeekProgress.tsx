type Props = {
  week: number;
};

export default function WeekProgress({ week }: Props) {
  const progress = (week / 24) * 100;

  return (
    <div className="w-full mt-4 iron-card-raised p-3">
      <div className="flex justify-between text-xs uppercase font-black text-iron-muted">
        <span>24 Week Path</span>
        <span className="text-iron-gold">Week {week} / 24</span>
      </div>

      <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
        <div
          className="h-full iron-progress-fill transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
