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
    <div className="mt-6 iron-card-raised p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black uppercase text-iron-gold">Daily Missions</h3>
        <p className="text-sm font-bold uppercase text-iron-muted">
          {completedCount} / {totalCount}
        </p>
      </div>

      <div className="w-full h-4 iron-progress-track mb-4 overflow-hidden rounded-sm">
        <div
          className="h-full iron-progress-fill transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="space-y-2">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center justify-between border p-3 rounded-sm ${
              mission.completed ? "iron-chip-done" : "iron-chip-pending"
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
