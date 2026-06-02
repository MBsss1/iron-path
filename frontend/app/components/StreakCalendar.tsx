export type StreakDayStatus = "completed" | "neutral" | "future";

export type StreakDay = {
  day: string;
  date: number;
  status: StreakDayStatus;
  isToday?: boolean;
};

type Props = {
  days: StreakDay[];
};

export default function StreakCalendar({ days }: Props) {
  const completedCount = days.filter((day) => day.status === "completed").length;

  const getCardStyles = (status: StreakDayStatus, isToday?: boolean) => {
    if (isToday && status === "neutral") {
      return "bg-iron-raised text-iron-text border-iron-accent border-2";
    }

    switch (status) {
      case "completed":
        return "bg-iron-accent-dim/25 text-iron-text border-iron-accent-dim";
      case "neutral":
        return "bg-iron-raised text-iron-muted border-iron-border";
      case "future":
        return "bg-iron-charcoal text-iron-muted border-iron-border";
    }
  };

  const getStatusLabel = (status: StreakDayStatus, isToday?: boolean) => {
    if (status === "completed") return "✓";
    if (status === "future") return "—";
    if (isToday) return "·";
    return "—";
  };

  return (
    <div className="mt-6 border border-iron-border p-4 iron-card-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="iron-heading text-lg">This week</h3>
        <p className="text-sm text-iron-muted">
          {completedCount} / {days.length} logged
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((dayData) => (
          <div
            key={`${dayData.day}-${dayData.date}`}
            className={`border p-3 text-center ${getCardStyles(
              dayData.status,
              dayData.isToday
            )}`}
          >
            <p className="text-xs font-semibold">{dayData.day}</p>
            <p className="text-lg font-semibold mt-1">{dayData.date}</p>
            <p className="text-xs mt-2">{getStatusLabel(dayData.status, dayData.isToday)}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-iron-muted text-center">
        Based on daily login streak. Unlogged days stay blank.
      </p>
    </div>
  );
}
