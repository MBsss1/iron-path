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
  onClose: () => void;
};

export default function SkillTreeScreen({ classId, level, onClose }: Props) {
  const classDef = getClass(classId);

  if (!classDef) {
    return (
      <ScreenShell
        eyebrow="Abilities"
        title="Skill Tree"
        subtitle="Select a class first"
        onBack={onClose}
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
      onBack={onClose}
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
        <div className="w-full h-4 border-2 border-[#efe3c2] mt-4">
          <div
            className="h-full bg-[#b22222] transition-all duration-500"
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
                        isUnlocked ? "text-[#b22222]" : "opacity-60"
                      }`}
                    >
                      Passive: {classDef.skill1Passive.label}
                      {!isUnlocked && ` · unlocks at level ${requiredLevel}`}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 px-2 py-1 border-2 border-black text-[10px] font-black uppercase ${
                    isUnlocked
                      ? "bg-[#b22222] text-[#efe3c2]"
                      : "bg-gray-400 text-gray-700"
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
                  <div className="w-full h-3 border-2 border-black mt-2 bg-[#f5ead0]">
                    <div
                      className="h-full bg-[#b22222] transition-all duration-500"
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
