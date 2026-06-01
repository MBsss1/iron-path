import ShareProgressCard from "./ShareProgressCard";

type Props = {
  onSelectProgress: () => void;
  onSelectAchievements: () => void;
  onSelectBosses?: () => void;
  onSelectStrength?: () => void;
  onSelectLegacy?: () => void;
  onSelectSettings?: () => void;
  onSelectProfile?: () => void;
  onSelectStats?: () => void;
  onSelectSkillTree?: () => void;
  level: number;
  rank: string;
  week: number;
  phase: string;
  streak: number;
  body: number;
  mind: number;
  work: number;
  equippedTitle?: string | null;
};

export default function MoreScreen({
  onSelectProgress,
  onSelectAchievements,
  onSelectBosses,
  onSelectStrength,
  onSelectLegacy,
  onSelectSettings,
  onSelectProfile,
  onSelectStats,
  onSelectSkillTree,
  level,
  rank,
  week,
  phase,
  streak,
  body,
  mind,
  work,
  equippedTitle,
}: Props) {
  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">
          Menu
        </p>

        <h2 className="text-4xl font-black uppercase mt-2">
          More
        </h2>

        <p className="mt-2 uppercase text-sm">
          Additional options and records
        </p>
      </div>

      <div className="mt-8">
        <ShareProgressCard
          level={level}
          rank={rank}
          week={week}
          phase={phase}
          streak={streak}
          body={body}
          mind={mind}
          work={work}
          equippedTitle={equippedTitle}
        />
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={onSelectProfile}
          className="w-full border-4 border-black p-5 sm:p-6 bg-[#e8d8b0] hover:bg-[#d4c89a] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Identity</p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">👤 Profile</h3>
          <p className="mt-3 text-sm uppercase text-black">
            Edit avatar, stats, and training goal
          </p>
        </button>

        <button
          onClick={onSelectStats}
          className="w-full border-4 border-black p-5 sm:p-6 bg-[#efe3c2] hover:bg-[#e6dcc0] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Records</p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">📈 Stats</h3>
          <p className="mt-3 text-sm uppercase text-black">
            View XP, streaks, workouts, and milestones
          </p>
        </button>

        <button
          onClick={onSelectBosses}
          className="w-full border-4 border-black p-5 sm:p-6 bg-black text-[#efe3c2] hover:bg-[#1a1a1a] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-[#b22222]">
            Inner War
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            ⚔ Boss Trials
          </h3>
          <p className="mt-3 text-sm uppercase">
            Face inner foes. Earn titles, badges, and glory
          </p>
        </button>

        <button
          onClick={onSelectProgress}
          className="w-full border-4 border-black p-5 sm:p-6 bg-black text-[#efe3c2] hover:bg-[#333] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            View Progress
          </p>

          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            📊 Progress
          </h3>

          <p className="mt-3 text-sm uppercase">
            Track your journey, weeks, and XP milestones
          </p>
        </button>

        <button
          onClick={onSelectLegacy}
          className="w-full border-4 border-black p-6 bg-[#efe3c2] hover:bg-[#e6dcc0] transition-colors"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Legacy</p>

          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">🏺 Legacy</h3>

          <p className="mt-3 text-sm uppercase text-black">View completed seasons and records</p>
        </button>

        <button
          onClick={onSelectAchievements}
          className="w-full border-4 border-black p-6 bg-[#e8d8b0] hover:bg-[#d4c89a] transition-colors"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            View Achievements
          </p>

          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            ⭐ Achievements
          </h3>

          <p className="mt-3 text-sm uppercase text-black">
            Unlock milestones and unlock your potential
          </p>
        </button>

        <button
          onClick={onSelectStrength}
          className="w-full border-4 border-black p-6 bg-[#efe3c2] hover:bg-[#e6dcc0] transition-colors"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Strength Tracker</p>

          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">💪 Strength</h3>

          <p className="mt-3 text-sm uppercase text-black">Track push-ups, pull-ups, dips, runs and weight</p>
        </button>

        <button
          onClick={onSelectSkillTree}
          className="w-full border-4 border-black p-5 sm:p-6 bg-[#e8d8b0] hover:bg-[#d4c89a] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Abilities</p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">🌳 Skill Tree</h3>
          <p className="mt-3 text-sm uppercase text-black">
            View class skills and unlock progress
          </p>
        </button>

        <button
          onClick={onSelectSettings}
          className="w-full border-4 border-black p-6 bg-black text-[#efe3c2] hover:bg-[#333] transition-colors"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">App Settings</p>

          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">⚙ Settings</h3>

          <p className="mt-3 text-sm uppercase">Reset progress and manage your data</p>
        </button>
      </div>
    </div>
  );
}
