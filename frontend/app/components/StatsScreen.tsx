import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  totalXp: number;
  level: number;
  highestLevel: number;
  workoutCount: number;
  missionsCompleted: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  seasonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceStart: number;
  onClose: () => void;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center border-b border-black/20 pb-3 last:border-0 last:pb-0">
      <span className="uppercase text-xs sm:text-sm font-bold">{label}</span>
      <span className="font-black text-lg">{value}</span>
    </div>
  );
}

export default function StatsScreen({
  totalXp,
  level,
  highestLevel,
  workoutCount,
  missionsCompleted,
  achievementsUnlocked,
  achievementsTotal,
  seasonsCompleted,
  currentStreak,
  longestStreak,
  daysSinceStart,
  onClose,
}: Props) {
  return (
    <ScreenShell
      eyebrow="Records"
      title="Stats"
      subtitle="Your complete Iron Path history"
      onBack={onClose}
    >
      <IronCard variant="dark">
        <div className="space-y-3">
          <StatRow label="Total XP Earned" value={totalXp.toLocaleString()} />
          <StatRow label="Current Level" value={level} />
          <StatRow label="Highest Level" value={highestLevel} />
          <StatRow label="Workouts Completed" value={workoutCount} />
          <StatRow label="Missions Completed" value={missionsCompleted} />
          <StatRow
            label="Achievements"
            value={`${achievementsUnlocked} / ${achievementsTotal}`}
          />
          <StatRow label="Seasons Completed" value={seasonsCompleted} />
          <StatRow label="Current Streak" value={`${currentStreak} days`} />
          <StatRow label="Longest Streak" value={`${longestStreak} days`} />
          <StatRow label="Days on Path" value={daysSinceStart} />
        </div>
      </IronCard>
    </ScreenShell>
  );
}
