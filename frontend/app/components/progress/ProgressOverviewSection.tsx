"use client";

import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { translateGoal, translatePhase } from "../../i18n/labels";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  xp: number;
  maxXp: number;
  goal: string;
  totalXp: number;
  workoutCount: number;
  missionsCompleted: number;
  highestLevel: number;
  daysSinceStart: number;
};

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center border-b border-iron-border pb-2 last:border-0 last:pb-0">
      <span className="uppercase text-xs font-bold text-iron-muted">{label}</span>
      <span className="font-black text-iron-cream">{value}</span>
    </div>
  );
}

export default function ProgressOverviewSection({
  level,
  rank,
  week,
  phase,
  xp,
  maxXp,
  goal,
  totalXp,
  workoutCount,
  missionsCompleted,
  highestLevel,
  daysSinceStart,
}: Props) {
  const { t } = useTranslation();
  const pathProgress = (week / 24) * 100;
  const xpProgress = maxXp > 0 ? (xp / maxXp) * 100 : 0;
  const phaseLabel = translatePhase(phase, t);
  const goalLabel = translateGoal(goal, t);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">
            {t("progressScreen.level")}
          </p>
          <p className="text-4xl font-black text-iron-text">{level}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">{rank}</p>
        </div>

        <div className="iron-card-panel p-4 text-center">
          <p className="uppercase text-xs font-bold text-iron-gold">
            {t("progressScreen.week")}
          </p>
          <p className="text-4xl font-black text-iron-text">{week}</p>
          <p className="uppercase text-xs mt-1 text-iron-muted">
            {t("progressScreen.weekOf")}
          </p>
        </div>
      </div>

      <div className="iron-card-raised p-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>{t("progressScreen.xpProgress")}</span>
          <span className="text-iron-muted">
            {xp} / {maxXp}
          </span>
        </div>
        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={xpProgress} />
        </div>
      </div>

      <div className="iron-card-panel p-4 space-y-2">
        <StatRow label={t("progressScreen.currentPhase")} value={phaseLabel} />
        <StatRow label={t("progressScreen.goal")} value={goalLabel} />
      </div>

      <div className="iron-card-raised p-4">
        <div className="flex justify-between uppercase text-sm font-black text-iron-text">
          <span>{t("progressScreen.path24")}</span>
          <span className="text-iron-gold">{Math.round(pathProgress)}%</span>
        </div>
        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={pathProgress} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="iron-card-panel p-3 text-center">
          <p className="text-xs uppercase text-iron-muted">{t("statsScreen.totalXp")}</p>
          <p className="text-xl font-black text-iron-cream mt-1">
            {totalXp.toLocaleString()}
          </p>
        </div>
        <div className="iron-card-panel p-3 text-center">
          <p className="text-xs uppercase text-iron-muted">
            {t("statsScreen.workoutsCompleted")}
          </p>
          <p className="text-xl font-black text-iron-cream mt-1">{workoutCount}</p>
        </div>
        <div className="iron-card-panel p-3 text-center">
          <p className="text-xs uppercase text-iron-muted">
            {t("statsScreen.missionsCompleted")}
          </p>
          <p className="text-xl font-black text-iron-cream mt-1">{missionsCompleted}</p>
        </div>
        <div className="iron-card-panel p-3 text-center">
          <p className="text-xs uppercase text-iron-muted">{t("statsScreen.highestLevel")}</p>
          <p className="text-xl font-black text-iron-cream mt-1">{highestLevel}</p>
        </div>
      </div>

      <div className="iron-card-panel p-4">
        <StatRow label={t("statsScreen.daysOnPath")} value={daysSinceStart} />
      </div>
    </div>
  );
}
