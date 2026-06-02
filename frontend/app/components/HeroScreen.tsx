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
  if (!goal) return "—";
  return goal.replace(/_/g, " ");
}

function getMissionIcon(id: DailyMission["id"]) {
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
}

function getXpMotivation(xp: number, maxXp: number, level: number) {
  const remaining = maxXp - xp;
  const pct = maxXp > 0 ? Math.round((xp / maxXp) * 100) : 0;

  if (remaining <= 0) {
    return "Level up is within reach — finish strong today.";
  }
  if (pct >= 75) {
    return `Only ${remaining} XP to Level ${level + 1}. One more mission.`;
  }
  if (pct >= 40) {
    return "Steady grind. Stack XP before the day ends.";
  }
  return "Start with Today — small wins compound.";
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
  const seasonPercent = Math.min(100, Math.round((week / 24) * 100));
  const allMissionsDone = totalCount > 0 && completedCount >= totalCount;

  return (
    <div className="mt-6 sm:mt-8 border-4 border-black p-4 sm:p-5 bg-[#f5ead0] shadow-2xl mb-6 space-y-4">
      {/* 1. Compact Character Identity */}
      <section className="flex gap-4 items-start">
        <img
          src={getAvatar(level, profile.avatarId)}
          alt="Avatar"
          className="w-24 h-32 sm:w-28 sm:h-36 object-cover border-4 border-black shrink-0"
        />

        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-2xl sm:text-3xl font-black leading-none">
            LEVEL {level}
          </h2>
          <p className="uppercase tracking-widest text-sm font-bold mt-1">
            {rank}
          </p>
          {titleLabel && (
            <p className="mt-1 uppercase text-xs font-black text-[#b22222] tracking-wider truncate">
              {titleLabel}
            </p>
          )}
          {classDef && (
            <p className="mt-2 text-sm font-black uppercase truncate">
              <span aria-hidden="true">{classDef.icon}</span> {classDef.name}
            </p>
          )}
        </div>
      </section>

      {/* 2. Next Reward Card */}
      <section className="border-2 border-black p-4 bg-[#e8d8b0]">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-black uppercase">Next Reward</h3>
          <span className="text-xs font-bold uppercase shrink-0">
            {xp} / {maxXp} XP
          </span>
        </div>

        <div className="w-full h-4 border-2 border-black mt-3 bg-[#f5ead0]">
          <div
            className="h-full bg-[#b22222] transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <p className="mt-2 text-xs uppercase font-bold">
          {nextRank === "MAX RANK"
            ? `Level ${level} · Max rank achieved`
            : `Next rank · ${nextRank} at Level ${level + 1}`}
        </p>

        <p className="mt-2 text-xs leading-relaxed normal-case font-bold text-black/80">
          {getXpMotivation(xp, maxXp, level)}
        </p>
      </section>

      {/* 3. Daily Progress Card */}
      <section className="border-2 border-black p-4 bg-black text-[#efe3c2]">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-black uppercase">Daily Progress</h3>
          <span className="text-xs font-bold uppercase">
            {completedCount} / {totalCount}
          </span>
        </div>

        <div className="w-full h-3 border-2 border-[#efe3c2] mt-3 bg-[#333]">
          <div
            className="h-full bg-[#b22222] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {missions.map((mission) => (
            <span
              key={mission.id}
              className={`inline-flex items-center gap-1 border-2 px-2 py-1 text-[10px] sm:text-xs font-black uppercase ${
                mission.completed
                  ? "border-[#b22222] bg-[#b22222] text-[#efe3c2]"
                  : "border-[#efe3c2]/50 bg-transparent text-[#efe3c2]/80"
              }`}
            >
              <span aria-hidden="true">{getMissionIcon(mission.id)}</span>
              {mission.name}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onContinueToday}
          className="w-full mt-4 border-4 border-[#efe3c2] bg-[#b22222] text-[#efe3c2] py-3 uppercase font-black tracking-widest text-sm transition-transform active:scale-[0.98]"
        >
          {allMissionsDone ? "Review Today" : "Continue Today"}
        </button>
      </section>

      {/* 4. Current Boss Card */}
      <section className="border-2 border-black p-4 bg-[#e8d8b0]">
        <h3 className="text-sm font-black uppercase">Current Boss</h3>

        {allBossesDefeated ? (
          <p className="mt-3 text-sm font-black uppercase text-[#b22222]">
            All bosses defeated
          </p>
        ) : currentBoss ? (
          <>
            <p className="mt-2 text-xl font-black uppercase">{currentBoss.name}</p>
            <p className="mt-1 text-xs leading-relaxed">{currentBoss.description}</p>

            <div className="mt-3">
              <div className="flex justify-between text-xs font-bold uppercase gap-2">
                <span className="truncate">{bossProgressLabel}</span>
                <span className="shrink-0">{bossProgressPercent}%</span>
              </div>
              <div className="w-full h-3 border-2 border-black mt-2 bg-[#f5ead0]">
                <div
                  className="h-full bg-[#b22222] transition-all duration-500"
                  style={{ width: `${bossProgressPercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-xs font-bold uppercase text-black/70">
            Train and level up to unlock the next boss.
          </p>
        )}

        <button
          type="button"
          onClick={onViewBoss}
          className="w-full mt-4 border-2 border-black bg-black text-[#efe3c2] py-2.5 uppercase font-black text-xs tracking-wider transition-transform active:scale-[0.98]"
        >
          View Boss
        </button>
      </section>

      {/* 5. Current Goal compact */}
      <section className="border-2 border-black px-4 py-3 bg-black text-[#efe3c2]">
        <p className="text-xs uppercase font-bold tracking-widest">Current Goal</p>
        <p className="mt-1 text-sm font-black uppercase">
          {formatGoal(profile.goal)} · {program.phase}
        </p>
        <p className="mt-1 text-xs uppercase font-bold text-[#efe3c2]/80">
          Week {week} / 24
        </p>
      </section>

      {/* 6. Collapsed lower info */}
      <section className="border-2 border-black px-4 py-3 bg-[#e8d8b0] text-center space-y-2">
        <p className="text-xs font-black uppercase tracking-wide">
          Body {body} · Mind {mind} · Work {work}
        </p>
        <p className="text-xs font-bold uppercase">
          Streak · {streak} {streak === 1 ? "day" : "days"}
        </p>
        <div>
          <div className="flex justify-between text-[10px] font-black uppercase">
            <span>Season path</span>
            <span>
              Week {week}/24 · {seasonPercent}%
            </span>
          </div>
          <div className="w-full h-2 border border-black mt-1 bg-[#f5ead0]">
            <div
              className="h-full bg-[#b22222]"
              style={{ width: `${seasonPercent}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
