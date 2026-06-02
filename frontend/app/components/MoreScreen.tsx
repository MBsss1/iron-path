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

const menuBtn =
  "iron-interactive w-full border p-5 sm:p-6 min-h-[48px] text-left hover:border-iron-gold-dim/50";

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
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <div className="text-center">
        <p className="iron-label">Menu</p>

        <h2 className="iron-heading text-3xl mt-2">More</h2>

        <p className="mt-2 text-sm text-iron-muted">Records and settings</p>
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
          className={`${menuBtn} iron-card-raised border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Identity
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">👤 Profile</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            Edit avatar, stats, and training goal
          </p>
        </button>

        <button
          onClick={onSelectStats}
          className={`${menuBtn} iron-card-surface border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Records
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">📈 Stats</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            View XP, streaks, workouts, and milestones
          </p>
        </button>

        <button
          onClick={onSelectBosses}
          className={`${menuBtn} iron-dossier text-iron-text`}
        >
          <p className="iron-label text-iron-danger">Operations</p>
          <h3 className="iron-heading text-xl mt-2">Target dossiers</h3>
          <p className="mt-2 text-sm text-iron-muted">
            Mission files, requirements, and clearance rewards
          </p>
        </button>

        <button
          onClick={onSelectProgress}
          className={`${menuBtn} iron-card-panel border-iron-border-strong text-iron-cream`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            View Progress
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">📊 Progress</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            Track your journey, weeks, and XP milestones
          </p>
        </button>

        <button
          onClick={onSelectLegacy}
          className={`${menuBtn} iron-card-surface border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">Legacy</p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">🏺 Legacy</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            View completed seasons and records
          </p>
        </button>

        <button
          onClick={onSelectAchievements}
          className={`${menuBtn} iron-card-raised border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            View Achievements
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">⭐ Achievements</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            Unlock milestones and unlock your potential
          </p>
        </button>

        <button
          onClick={onSelectStrength}
          className={`${menuBtn} iron-card-surface border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Strength Tracker
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">💪 Strength</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            Track push-ups, pull-ups, dips, runs and weight
          </p>
        </button>

        <button
          onClick={onSelectSkillTree}
          className={`${menuBtn} iron-card-raised border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            Abilities
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">🌳 Skill Tree</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            View class skills and unlock progress
          </p>
        </button>

        <button
          onClick={onSelectSettings}
          className={`${menuBtn} iron-card-panel border-iron-border text-iron-text`}
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold text-iron-gold">
            App Settings
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">⚙ Settings</h3>
          <p className="mt-3 text-sm uppercase text-iron-muted">
            Reset progress and manage your data
          </p>
        </button>
      </div>
    </div>
  );
}
