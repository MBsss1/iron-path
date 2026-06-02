"use client";

import { useState } from "react";
import { AVATAR_OPTIONS } from "../data/avatar";
import { CLASSES, type ClassId } from "../data/classes";
import { getBadgeLabel, getTitleLabel } from "../data/bosses";
import type { Profile } from "../hooks/useProfile";
import { canChangeClass, daysUntilClassChange } from "../utils/classBonuses";
import ClassCard from "./ClassCard";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";
import IronButton from "./IronButton";

type Props = {
  profile: Profile;
  level: number;
  onSave: (profile: Profile) => void;
  onBack: () => void;
  equippedTitle: string | null;
  unlockedTitleIds: string[];
  defeatedBadges: string[];
  onEquipTitle: (titleId: string | null) => void;
};

export default function ProfileScreen({
  profile,
  level,
  onSave,
  onBack,
  equippedTitle,
  unlockedTitleIds,
  defeatedBadges,
  onEquipTitle,
}: Props) {
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [goal, setGoal] = useState(profile.goal);
  const [experience, setExperience] = useState(profile.experience);
  const [watchType, setWatchType] = useState(profile.watchType);
  const [avatarId, setAvatarId] = useState(profile.avatarId ?? "rookie");
  const [classId, setClassId] = useState<ClassId>(
    profile.classId ?? "warrior"
  );

  const classChangeAllowed = canChangeClass(profile.classChangedAt);
  const daysRemaining = daysUntilClassChange(profile.classChangedAt);

  const handleSave = () => {
    const finalClassId = classChangeAllowed
      ? classId
      : (profile.classId ?? classId);

    const nextProfile: Profile = {
      age,
      height,
      weight,
      goal,
      experience,
      watchType,
      avatarId,
      classId: finalClassId,
      classChangedAt: profile.classChangedAt,
    };

    if (finalClassId !== profile.classId && classChangeAllowed) {
      nextProfile.classChangedAt = new Date().toISOString();
    }

    onSave(nextProfile);
    onBack();
  };

  const inputClass =
    "w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] text-base";

  return (
    <ScreenShell
      eyebrow="Identity"
      title="Profile"
      subtitle="Update your path and avatar"
      onBack={onBack}
    >
      <IronCard>
        <p className="uppercase text-xs font-bold tracking-widest mb-3">
          Avatar
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVATAR_OPTIONS.map((option) => {
            const locked = level < option.minLevel;
            const selected = avatarId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={locked}
                onClick={() => setAvatarId(option.id)}
                className={`border border-iron-border p-2 text-center transition-transform active:scale-95 min-h-[44px] ${
                  selected
                    ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
                    : locked
                      ? "bg-iron-charcoal opacity-60 text-iron-muted"
                      : "iron-card-raised text-iron-text"
                }`}
              >
                <img
                  src={option.src}
                  alt={option.label}
                  className="w-full h-20 object-cover border border-iron-border mb-2"
                />
                <p className="text-xs font-black uppercase">{option.label}</p>
                {locked && (
                  <p className="text-[10px] uppercase mt-1">Lv {option.minLevel}</p>
                )}
              </button>
            );
          })}
        </div>
      </IronCard>

      <IronCard variant="paper">
        <p className="uppercase text-xs font-bold tracking-widest mb-3">
          Class
        </p>
        {!classChangeAllowed && (
          <p className="iron-label mb-3">
            Class change available in {daysRemaining} day
            {daysRemaining === 1 ? "" : "s"}
          </p>
        )}
        <div className="space-y-3">
          {CLASSES.map((classDef) => (
            <ClassCard
              key={classDef.id}
              classDef={classDef}
              selected={classId === classDef.id}
              onSelect={() => {
                if (classChangeAllowed) setClassId(classDef.id);
              }}
            />
          ))}
        </div>
      </IronCard>

      <IronCard variant="dark">
        <p className="uppercase text-xs font-bold tracking-widest mb-3">
          Title
        </p>
        {equippedTitle && (
          <p className="text-center text-lg font-semibold iron-text-accent mb-3">
            {getTitleLabel(equippedTitle)}
          </p>
        )}
        {unlockedTitleIds.length === 0 ? (
          <p className="text-xs uppercase text-center opacity-80">
            Defeat bosses to unlock titles
          </p>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onEquipTitle(null)}
              className={`w-full border border-iron-border p-2 uppercase text-xs font-bold ${
                !equippedTitle ? "bg-iron-accent-dim text-iron-bg" : "bg-transparent text-iron-text"
              }`}
            >
              No Title
            </button>
            {unlockedTitleIds.map((titleId) => (
              <button
                key={titleId}
                type="button"
                onClick={() => onEquipTitle(titleId)}
                className={`w-full border border-iron-border p-2 uppercase text-xs font-bold ${
                  equippedTitle === titleId ? "bg-iron-accent-dim text-iron-bg" : "bg-transparent text-iron-text"
                }`}
              >
                {getTitleLabel(titleId)}
              </button>
            ))}
          </div>
        )}
        {defeatedBadges.length > 0 && (
          <div className="mt-4 border-t border-iron-border pt-3">
            <p className="uppercase text-xs font-bold mb-2">Boss Badges</p>
            <div className="flex flex-wrap gap-2">
              {defeatedBadges.map((badge) => (
                <span
                  key={badge}
                  className="border border-iron-border px-2 py-1 text-[10px] font-black uppercase text-iron-cream"
                >
                  {getBadgeLabel(badge)}
                </span>
              ))}
            </div>
          </div>
        )}
      </IronCard>

      <IronCard variant="paper">
        <div className="space-y-4">
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className={inputClass}
          />
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height"
            className={inputClass}
          />
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kg)"
            className={inputClass}
          />

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className={inputClass}
          >
            <option value="mass_gain">Mass Gain</option>
            <option value="athletic">Athletic</option>
            <option value="runner">Runner</option>
            <option value="fat_loss">Fat Loss</option>
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className={inputClass}
          >
            <option value="beginner">Beginner</option>
            <option value="returning">Returning</option>
            <option value="trained">Trained</option>
          </select>

          <select
            value={watchType}
            onChange={(e) => setWatchType(e.target.value)}
            className={inputClass}
          >
            <option value="apple_watch">Apple Watch</option>
            <option value="android_watch">Android Watch</option>
            <option value="none">No Watch</option>
          </select>
        </div>
      </IronCard>

      <IronButton onClick={handleSave}>Save Profile</IronButton>
    </ScreenShell>
  );
}
