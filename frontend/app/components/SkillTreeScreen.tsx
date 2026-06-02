"use client";

import {
  getClass,
  getSkillRequiredLevel,
  getUnlockedSkillCount,
  isSkillUnlockedAtLevel,
  type ClassId,
} from "../data/classes";
import {
  translateClassName,
  translateClassSkill,
  translateSkillPassive,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  classId: ClassId | string;
  level: number;
  onBack: () => void;
};

export default function SkillTreeScreen({ classId, level, onBack }: Props) {
  const { t } = useTranslation();
  const classDef = getClass(classId);

  if (!classDef) {
    return (
      <ScreenShell
        eyebrow={t("skillTreeScreen.eyebrow")}
        title={t("skillTreeScreen.noClassTitle")}
        subtitle={t("skillTreeScreen.noClassSubtitle")}
        onBack={onBack}
      >
        <IronCard variant="paper">
          <p className="uppercase text-sm font-bold text-center">
            {t("skillTreeScreen.noClassBody")}
          </p>
        </IronCard>
      </ScreenShell>
    );
  }

  const unlockedCount = getUnlockedSkillCount(level);
  const totalSkills = classDef.skills.length;
  const className = translateClassName(classDef.id, t);

  return (
    <ScreenShell
      eyebrow={t("skillTreeScreen.eyebrow")}
      title={t("skillTreeScreen.title")}
      subtitle={t("skillTreeScreen.subtitle", {
        className,
        unlocked: unlockedCount,
        total: totalSkills,
        level,
      })}
      onBack={onBack}
    >
      <IronCard variant="dark">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {classDef.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="uppercase text-xs font-bold">{className}</p>
            <p className="text-sm uppercase mt-1 opacity-80">
              {t("skillTreeScreen.unlockHint")}
            </p>
          </div>
        </div>
        <div className="w-full h-4 iron-progress-track mt-4 overflow-hidden">
          <div
            className="h-full iron-progress-fill transition-all duration-500"
            style={{
              width: `${Math.round((unlockedCount / totalSkills) * 100)}%`,
            }}
          />
        </div>
      </IronCard>

      <div className="space-y-3">
        {classDef.skills.map((skill, index) => {
          const requiredLevel = getSkillRequiredLevel(index);
          const isUnlocked = isSkillUnlockedAtLevel(index, level);
          const progressPercent = Math.min(
            100,
            Math.round((level / requiredLevel) * 100)
          );
          const passiveLabel = translateSkillPassive(
            classDef.id,
            classDef.skill1Passive.label,
            t
          );

          return (
            <IronCard
              key={skill.id}
              variant={isUnlocked ? "tan" : "paper"}
              className={isUnlocked ? "" : "opacity-90"}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                    {t("skillTreeScreen.skillMeta", {
                      index: index + 1,
                      level: requiredLevel,
                    })}
                  </p>
                  <h3 className="text-lg font-black uppercase mt-1">
                    {translateClassSkill(
                      classDef.id,
                      skill.id,
                      "name",
                      skill.name,
                      t
                    )}
                  </h3>
                  <p className="text-xs uppercase mt-2 leading-relaxed">
                    {isUnlocked
                      ? translateClassSkill(
                          classDef.id,
                          skill.id,
                          "description",
                          skill.description,
                          t
                        )
                      : t("skillTreeScreen.requiresLevel", {
                          level: requiredLevel,
                        })}
                  </p>
                  {index === 0 && (
                    <p
                      className={`text-xs font-black uppercase mt-2 ${
                        isUnlocked ? "text-iron-accent" : "text-iron-muted"
                      }`}
                    >
                      {t("skillTreeScreen.passive", { label: passiveLabel })}
                      {!isUnlocked &&
                        t("skillTreeScreen.passiveUnlocks", {
                          level: requiredLevel,
                        })}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 px-2 py-1 border border-iron-border text-[10px] font-black uppercase ${
                    isUnlocked
                      ? "bg-iron-accent-dim text-iron-bg"
                      : "bg-iron-charcoal text-iron-muted"
                  }`}
                >
                  {isUnlocked ? t("common.unlocked") : t("common.locked")}
                </span>
              </div>

              {!isUnlocked && (
                <div className="mt-4">
                  <div className="flex justify-between uppercase text-xs font-bold">
                    <span>{t("common.progress")}</span>
                    <span>
                      {t("skillTreeScreen.levelProgress", {
                        current: level,
                        required: requiredLevel,
                      })}
                    </span>
                  </div>
                  <div className="w-full h-3 iron-progress-track mt-2 overflow-hidden">
                    <div
                      className="h-full iron-progress-fill transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </IronCard>
          );
        })}
      </div>
    </ScreenShell>
  );
}
