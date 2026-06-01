import { DailyMission } from "../hooks/useDailyMissions";

type Props = {
  missions: DailyMission[];
  completedCount: number;
  totalCount: number;
  progress: number;
};

export default function DailyMissionTracker({
  missions,
  completedCount,
  totalCount,
  progress,
}: Props) {
  const getMissionIcon = (id: string) => {
    switch (id) {
      case "workout":
        return "💪";
      case "deepwork":
        return "🧠";
      case "protein":
        return "🍖";
      case "sleep":
        return "😴";
      default:
        return "•";
    }
  };

  return (
    <div className="mt-6 border-2 border-black p-4 bg-[#e8d8b0]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black uppercase">Daily Missions</h3>
        <p className="text-sm font-bold uppercase">
          {completedCount} / {totalCount}
        </p>
      </div>

      <div className="w-full h-4 border-2 border-black mb-4 bg-[#f5ead0]">
        <div
          className="h-full bg-[#b22222] transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="space-y-2">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center justify-between border-2 p-3 ${
              mission.completed
                ? "bg-black text-[#efe3c2] border-black"
                : "bg-gray-300 text-gray-600 border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getMissionIcon(mission.id)}</span>
              <p className="font-bold uppercase text-sm">{mission.name}</p>
            </div>

            <p className="font-black text-xs">
              {mission.completed ? "✓" : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
