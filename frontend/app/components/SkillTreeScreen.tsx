"use client";

import {
  getClass,
  getSkillRequiredLevel,
  getUnlockedSkillCount,
  isSkillUnlockedAtLevel,
  type ClassId,
} from "../data/classes";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  classId: ClassId | string;
  level: number;
  onBack: () => void;
};

export default function SkillTreeScreen({ classId, level, onBack }: Props) {
  const classDef = getClass(classId);

  if (!classDef) {
    return (
      <ScreenShell
        eyebrow="Abilities"
        title="Skill Tree"
        subtitle="Select a class first"
        onBack={onBack}
      >
        <IronCard variant="paper">
          <p className="uppercase text-sm font-bold text-center">
            No class selected. Choose a class from your profile.
          </p>
        </IronCard>
      </ScreenShell>
    );
  }

  const unlockedCount = getUnlockedSkillCount(level);
  const totalSkills = classDef.skills.length;

  return (
    <ScreenShell
      eyebrow="Abilities"
      title="Skill Tree"
      subtitle={`${classDef.name} — ${unlockedCount} / ${totalSkills} unlocked · Level ${level}`}
      onBack={onBack}
    >
      <IronCard variant="dark">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {classDef.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className="uppercase text-xs font-bold">{classDef.name}</p>
            <p className="text-sm uppercase mt-1 opacity-80">
              Skills unlock automatically at levels 5, 10, and 15
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

          return (
            <IronCard
              key={skill.id}
              variant={isUnlocked ? "tan" : "paper"}
              className={isUnlocked ? "" : "opacity-90"}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                    Skill {index + 1} · Level {requiredLevel}
                  </p>
                  <h3 className="text-lg font-black uppercase mt-1">
                    {skill.name}
                  </h3>
                  <p className="text-xs uppercase mt-2 leading-relaxed">
                    {isUnlocked
                      ? skill.description
                      : `Requires level ${requiredLevel} to unlock.`}
                  </p>
                  {index === 0 && (
                    <p
                      className={`text-xs font-black uppercase mt-2 ${
                        isUnlocked ? "text-iron-accent" : "text-iron-muted"
                      }`}
                    >
                      Passive: {classDef.skill1Passive.label}
                      {!isUnlocked && ` · unlocks at level ${requiredLevel}`}
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
                  {isUnlocked ? "Unlocked" : "Locked"}
                </span>
              </div>

              {!isUnlocked && (
                <div className="mt-4">
                  <div className="flex justify-between uppercase text-xs font-bold">
                    <span>Progress</span>
                    <span>
                      Level {level} / {requiredLevel}
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
