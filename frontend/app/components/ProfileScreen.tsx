"use client";

import { useState } from "react";
import { AVATAR_OPTIONS } from "../data/avatar";
import type { Profile } from "../hooks/useProfile";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";
import IronButton from "./IronButton";

type Props = {
  profile: Profile;
  level: number;
  onSave: (profile: Profile) => void;
  onClose: () => void;
};

export default function ProfileScreen({
  profile,
  level,
  onSave,
  onClose,
}: Props) {
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [goal, setGoal] = useState(profile.goal);
  const [experience, setExperience] = useState(profile.experience);
  const [watchType, setWatchType] = useState(profile.watchType);
  const [avatarId, setAvatarId] = useState(profile.avatarId ?? "rookie");

  const handleSave = () => {
    onSave({
      age,
      height,
      weight,
      goal,
      experience,
      watchType,
      avatarId,
    });
    onClose();
  };

  const inputClass =
    "w-full border-2 border-black p-3 bg-white min-h-[48px] text-base";

  return (
    <ScreenShell
      eyebrow="Identity"
      title="Profile"
      subtitle="Update your path and avatar"
      onBack={onClose}
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
                className={`border-2 border-black p-2 text-center transition-transform active:scale-95 min-h-[44px] ${
                  selected
                    ? "bg-[#b22222] text-[#efe3c2]"
                    : locked
                      ? "bg-gray-300 opacity-60"
                      : "bg-[#f5ead0]"
                }`}
              >
                <img
                  src={option.src}
                  alt={option.label}
                  className="w-full h-20 object-cover border-2 border-black mb-2"
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
