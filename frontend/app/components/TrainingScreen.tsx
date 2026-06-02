"use client";

import { getNextMission } from "../data/workoutPlans";
import { getWorkoutXp } from "../data/xpRewards";
import type { ClassId } from "../data/classes";
import { applyClassXpBonus } from "../utils/classBonuses";
import { translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onCompleteWorkout: () => void;
  onCompleteWeek: () => void;
  program: any;
  classId?: ClassId | string | null;
  level: number;
};

export default function TrainingScreen({
  onCompleteWorkout,
  onCompleteWeek,
  program,
  classId,
  level,
}: Props) {
  const { t } = useTranslation();
  const mission = getNextMission(program.goal, program.phase);
  const workoutXp = applyClassXpBonus(
    getWorkoutXp(program.phase),
    classId,
    "workout",
    level
  );

  return (
    <div className="mt-8 sm:mt-10 iron-shell-card p-5 sm:p-6 mb-24">
      <div className="text-center">
        <p className="iron-label">{t("training.currentPhase")}</p>
        <h2 className="iron-heading text-3xl mt-2">
          {translatePhase(program.phase, t)}
        </h2>
        <p className="mt-2 text-sm text-iron-muted">
          {t("training.week", { week: program.week })}
        </p>
        <p className="mt-4 text-sm font-semibold text-iron-text">{program.focus}</p>
      </div>

      <div className="mt-8 border border-iron-border p-4 bg-iron-raised">
        <h3 className="iron-heading text-xl">{t("training.thisWeek")}</h3>
        <div className="mt-4 space-y-3 text-sm font-medium text-iron-text">
          {program.workouts?.map((workout: string, index: number) => (
            <div
              key={index}
              className="flex justify-between border-b border-iron-border pb-2"
            >
              <span>{workout}</span>
              <span>+{workoutXp} {t("common.xp")}</span>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <span>{t("training.strengthDays")}</span>
            <span>{program.strengthDays}</span>
          </div>

          <div className="flex justify-between">
            <span>{t("training.runDays")}</span>
            <span>{program.runDays}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-iron-border p-4 iron-card-panel">
        <p className="iron-label">{t("training.nextSession")}</p>
        <h3 className="iron-heading text-2xl mt-2">{mission.title}</h3>
        <div className="mt-3 border border-iron-border px-3 py-2 inline-block">
          <p className="text-xs text-iron-muted">{t("training.reward")}</p>
          <p className="text-xl font-semibold iron-text-accent">
            +{workoutXp} {t("common.xp")}
          </p>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          {mission.exercises.map(([name, value]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onCompleteWorkout}
        className="iron-interactive iron-btn-primary w-full mt-6 py-4 text-sm font-semibold min-h-[52px] rounded-sm"
      >
        {t("training.logWorkout")}
      </button>
      <button
        type="button"
        onClick={onCompleteWeek}
        className="iron-interactive iron-btn-secondary w-full mt-4 py-4 text-sm font-semibold min-h-[52px] rounded-sm"
      >
        {t("training.completeWeek")}
      </button>
    </div>
  );
}
