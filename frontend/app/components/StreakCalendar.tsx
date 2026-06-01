type DayStatus = "completed" | "missed" | "future";

export type StreakDay = {
  day: string;
  date: number;
  status: DayStatus;
};

type Props = {
  days?: StreakDay[];
};

export default function StreakCalendar({ days }: Props) {
  // Mock data: 7 days of the week
  const defaultDays: StreakDay[] = [
    { day: "Mon", date: 27, status: "completed" },
    { day: "Tue", date: 28, status: "completed" },
    { day: "Wed", date: 29, status: "completed" },
    { day: "Thu", date: 30, status: "missed" },
    { day: "Fri", date: 31, status: "completed" },
    { day: "Sat", date: 1, status: "future" },
    { day: "Sun", date: 2, status: "future" },
  ];

  const weekDays = days || defaultDays;
  const completedCount = weekDays.filter((d) => d.status === "completed").length;

  const getCardStyles = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return "bg-[#b22222] text-[#efe3c2] border-black";
      case "missed":
        return "bg-gray-400 text-gray-600 border-gray-500";
      case "future":
        return "bg-gray-300 text-gray-500 border-gray-400";
    }
  };

  return (
    <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black uppercase">This Week</h3>
        <p className="text-sm font-bold uppercase">
          {completedCount} / {weekDays.length} days
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((dayData, index) => (
          <div
            key={index}
            className={`border-2 p-3 text-center ${getCardStyles(dayData.status)}`}
          >
            <p className="text-xs font-black uppercase">{dayData.day}</p>
            <p className="text-lg font-black mt-1">{dayData.date}</p>
            <p className="text-xs mt-2 uppercase font-bold">
              {dayData.status === "completed" && "✓"}
              {dayData.status === "missed" && "✗"}
              {dayData.status === "future" && "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
