"use client";

import { getRank, getNextRank } from "../data/ranks";
import { getAvatar } from "../data/avatar";
import { getClass } from "../data/classes";
import { getTitleLabel } from "../data/bosses";
import type { BossDefinition } from "../data/bosses";
import type { Profile } from "../hooks/useProfile";
import type { DailyMission } from "../hooks/useDailyMissions";

type Props = {
  profile: Profile;
  level: number;
  xp: number;
  maxXp: number;
  body: number;
  mind: number;
  work: number;
  week: number;
  program: { phase: string };
  missions: DailyMission[];
  completedCount: number;
  totalCount: number;
  progress: number;
  streak: number;
  equippedTitle?: string | null;
  currentBoss: BossDefinition | null;
  bossProgressPercent: number;
  bossProgressLabel: string;
  allBossesDefeated: boolean;
  onContinueToday: () => void;
  onViewBoss: () => void;
};

function formatGoal(goal?: string) {
  if (!goal) return "Not set";
  return goal.replace(/_/g, " ");
}

function getMissionShortName(name: string) {
  if (name === "Deep Work") return "Deep work";
  return name.toLowerCase();
}

export default function HeroScreen({
  profile,
  level,
  xp,
  maxXp,
  body,
  mind,
  work,
  week,
  program,
  missions,
  completedCount,
  totalCount,
  progress,
  streak,
  equippedTitle,
  currentBoss,
  bossProgressPercent,
  bossProgressLabel,
  allBossesDefeated,
  onContinueToday,
  onViewBoss,
}: Props) {
  const classDef = getClass(profile.classId);
  const titleLabel = getTitleLabel(equippedTitle);
  const rank = getRank(level);
  const nextRank = getNextRank(level);
  const xpPercent = maxXp > 0 ? Math.min(100, Math.round((xp / maxXp) * 100)) : 0;
  const allMissionsDone = totalCount > 0 && completedCount >= totalCount;
  const bossRequirementMet = bossProgressPercent >= 100;

  return (
    <div className="mt-4 sm:mt-6 iron-shell-card p-4 mb-5 iron-stagger space-y-3">
      {/* 1. Character identity */}
      <section className="flex gap-3 items-center border-b border-iron-border pb-3">
        <img
          src={getAvatar(level, profile.avatarId)}
          alt=""
          className="w-16 h-20 sm:w-[4.5rem] sm:h-[5.5rem] object-cover iron-avatar-frame shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="iron-label">Operator</p>
          <h2 className="iron-heading text-xl sm:text-2xl mt-0.5">
            Level {level} · {rank}
          </h2>
          {titleLabel && (
            <p className="text-sm text-iron-accent mt-0.5 truncate">{titleLabel}</p>
          )}
          {classDef && (
            <p className="text-sm text-iron-muted mt-0.5">
              {classDef.name} · Body {body} · Mind {mind} · Work {work}
            </p>
          )}
          <p className="text-xs text-iron-muted mt-1">
            {streak} day streak · Week {week} of 24
          </p>
        </div>
      </section>

      {/* 2. Daily progress */}
      <section className="iron-card-raised p-3">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="iron-heading text-sm">Today&apos;s discipline</h3>
          <span className="text-xs text-iron-muted">
            {completedCount} / {totalCount}
          </span>
        </div>

        <div className="w-full h-2 iron-progress-track mt-2 overflow-hidden">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-iron-muted">
          {missions.map((mission) => (
            <li key={mission.id} className="flex items-center gap-1.5 min-w-0">
              <span className={mission.completed ? "text-iron-accent" : "text-iron-border-strong"}>
                {mission.completed ? "✓" : "□"}
              </span>
              <span className="truncate">{getMissionShortName(mission.name)}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onContinueToday}
          className="iron-interactive iron-btn-primary w-full mt-3 py-2.5 text-sm font-semibold rounded-sm"
        >
          {allMissionsDone ? "Review today's log" : "Open today's log"}
        </button>
      </section>

      {/* 3. Next reward */}
      <section className="iron-card-surface p-3">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="iron-heading text-sm">Next reward</h3>
          <span className="text-xs text-iron-muted">
            {xp} / {maxXp} xp
          </span>
        </div>
        <div className="w-full h-2 iron-progress-track mt-2 overflow-hidden">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-xs text-iron-muted mt-2">
          {nextRank === "MAX RANK"
            ? `Maximum rank held at level ${level}.`
            : `Next rank: ${nextRank} at level ${level + 1}.`}
        </p>
      </section>

      {/* 4. Current boss — target dossier */}
      <section className="iron-dossier p-3">
        <p className="iron-label text-iron-danger">Target dossier</p>

        {allBossesDefeated ? (
          <p className="text-sm text-iron-muted mt-2">
            All targets cleared. Maintain the standard.
          </p>
        ) : currentBoss ? (
          <>
            <h3 className="iron-heading text-lg mt-1 text-iron-text">{currentBoss.name}</h3>
            <p className="text-xs text-iron-muted mt-1 leading-relaxed">
              {currentBoss.description}
            </p>
            <div className="mt-3 border-t border-iron-border pt-2">
              <p className="iron-label mb-1.5">Requirements</p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-iron-danger shrink-0">
                  {bossRequirementMet ? "✓" : "□"}
                </span>
                <span>{currentBoss.requirement.label}</span>
              </p>
              <p className="text-xs text-iron-muted mt-1 pl-5">{bossProgressLabel}</p>
              <div className="w-full h-1.5 iron-progress-track mt-2 overflow-hidden">
                <div
                  className="h-full iron-progress-fill iron-progress-fill-danger"
                  style={{ width: `${bossProgressPercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-iron-muted mt-2">
            No active target. Continue training to unlock the next dossier.
          </p>
        )}

        <button
          type="button"
          onClick={onViewBoss}
          className="iron-interactive iron-btn-secondary w-full mt-3 py-2 text-xs font-semibold rounded-sm"
        >
          Open dossier file
        </button>
      </section>

      {/* 5. Current goal */}
      <section className="iron-card-panel px-3 py-2.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <div>
          <p className="iron-label">Current objective</p>
          <p className="text-iron-text mt-0.5">
            {formatGoal(profile.goal)} · {program.phase}
          </p>
        </div>
        <p className="text-xs text-iron-muted">Season week {week}/24</p>
      </section>
    </div>
  );
}
