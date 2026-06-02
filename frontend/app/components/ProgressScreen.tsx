"use client";

import { AVATAR_OPTIONS } from "../data/avatar";
import {
  translateAvatarLabel,
  translateGoal,
  translatePhase,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";

type Props = {
  level: number;
  rank: string;
  week: number;
  phase: string;
  xp: number;
  maxXp: number;
  weight: string;
  goal: string;
  avatarId?: string;
  onBack: () => void;
};

export default function ProgressScreen({
  level,
  rank,
  week,
  phase,
  xp,
  maxXp,
  weight,
  goal,
  avatarId,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const pathProgress = (week / 24) * 100;
  const xpProgress = (xp / maxXp) * 100;
  const phaseLabel = translatePhase(phase, t);
  const goalLabel = translateGoal(goal, t);

  return (
    <ScreenShell
      eyebrow={t("progressScreen.eyebrow")}
      title={t("progressScreen.title")}
      subtitle={t("progressScreen.subtitle")}
      onBack={onBack}
    >
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
          <span>{t("progressScreen.path24")}</span>
          <span className="text-iron-gold">{Math.round(pathProgress)}%</span>
        </div>

        <div className="w-full h-4 iron-progress-track mt-2 overflow-hidden rounded-sm">
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${pathProgress}%` }}
          />
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
          <div
            className="h-full iron-progress-fill"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="iron-card-panel p-4 space-y-3">
        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">{t("progressScreen.currentPhase")}</span>
          <span>{phaseLabel}</span>
        </div>

        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">{t("progressScreen.goal")}</span>
          <span>{goalLabel}</span>
        </div>

        <div className="flex justify-between uppercase text-sm text-iron-cream">
          <span className="text-iron-muted">{t("progressScreen.weight")}</span>
          <span>{t("progressScreen.weightUnit", { value: weight })}</span>
        </div>
      </div>

      <div className="iron-card-raised p-4">
        <h3 className="text-xl font-black uppercase text-iron-gold">
          {t("progressScreen.avatarEvolution")}
        </h3>

        <div className="mt-4 space-y-3 uppercase text-sm font-bold">
          {AVATAR_OPTIONS.map((option, index) => {
            const unlocked = level >= option.minLevel;
            const isSelected = avatarId === option.id;
            const label = translateAvatarLabel(option.id, option.label, t);

            return (
              <div
                key={option.id}
                className={`flex justify-between items-center gap-3 text-iron-text ${
                  index < AVATAR_OPTIONS.length - 1
                    ? "border-b border-iron-border pb-2"
                    : ""
                } ${unlocked ? "" : "opacity-50"}`}
              >
                <span>
                  {t("progressScreen.avatarLevel", {
                    level: option.minLevel,
                    label,
                  })}
                </span>
                <span
                  className={`shrink-0 ${isSelected ? "text-iron-gold" : "text-iron-muted"}`}
                >
                  {unlocked
                    ? isSelected
                      ? t("progressScreen.equipped")
                      : t("common.unlocked")
                    : t("progressScreen.locked")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
