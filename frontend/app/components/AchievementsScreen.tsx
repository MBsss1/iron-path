import { ACHIEVEMENTS, type AchievementId } from "../data/achievements";

type Props = {
  achievementsUnlocked: AchievementId[];
};

export default function AchievementsScreen({
  achievementsUnlocked,
}: Props) {
  const unlockedCount = achievementsUnlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Path Milestones
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          Achievements
        </h2>

        <p className="mt-2 uppercase text-sm">
          {unlockedCount} / {totalCount} unlocked
        </p>
      </div>

      <div className="mt-8 border-2 border-black p-4 bg-black text-[#efe3c2] text-center">
        <p className="uppercase text-xs font-bold">Progress</p>
        <p className="text-4xl font-black">
          {Math.round((unlockedCount / totalCount) * 100)}%
        </p>

        <div className="w-full h-4 border-2 border-[#efe3c2] mt-4">
          <div
            className="h-full bg-[#b22222]"
            style={{
              width: `${(unlockedCount / totalCount) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = achievementsUnlocked.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`border-2 border-black p-4 ${
                isUnlocked
                  ? "bg-[#e8d8b0]"
                  : "bg-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-black uppercase">
                    {achievement.title}
                  </h3>
                  <p className="text-sm mt-1 uppercase">
                    {achievement.description}
                  </p>
                </div>

                <div
                  className={`ml-4 px-3 py-2 border-2 border-black font-black uppercase text-xs whitespace-nowrap ${
                    isUnlocked
                      ? "bg-[#b22222] text-[#efe3c2]"
                      : "bg-gray-400 text-gray-600"
                  }`}
                >
                  {isUnlocked ? "✓ Unlocked" : "Locked"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
