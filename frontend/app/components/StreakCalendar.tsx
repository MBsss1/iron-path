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
      return "bg-[#f5ead0] text-black border-[#b22222] border-4";
    }

    switch (status) {
      case "completed":
        return "bg-[#b22222] text-[#efe3c2] border-black";
      case "neutral":
        return "bg-[#f5ead0] text-black/70 border-black";
      case "future":
        return "bg-gray-300 text-gray-500 border-gray-400";
    }
  };

  const getStatusLabel = (status: StreakDayStatus, isToday?: boolean) => {
    if (status === "completed") return "✓";
    if (status === "future") return "—";
    if (isToday) return "·";
    return "—";
  };

  return (
    <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black uppercase">This Week</h3>
        <p className="text-sm font-bold uppercase">
          {completedCount} / {days.length} logged
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((dayData) => (
          <div
            key={`${dayData.day}-${dayData.date}`}
            className={`border-2 p-3 text-center ${getCardStyles(
              dayData.status,
              dayData.isToday
            )}`}
          >
            <p className="text-xs font-black uppercase">{dayData.day}</p>
            <p className="text-lg font-black mt-1">{dayData.date}</p>
            <p className="text-xs mt-2 uppercase font-bold">
              {getStatusLabel(dayData.status, dayData.isToday)}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs uppercase font-bold text-black/60 text-center">
        Based on daily login streak. Unlogged days stay blank.
      </p>
    </div>
  );
}
