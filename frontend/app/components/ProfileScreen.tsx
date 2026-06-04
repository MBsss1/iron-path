"use client";

import { useState } from "react";
import { AVATAR_OPTIONS } from "../data/avatar";
import { getBadgeLabel } from "../data/bosses";
import {
  PATH_MODES,
  getPathModeFromProfile,
  normalizeProfilePath,
  pathModeToClassId,
  type PathMode,
} from "../data/pathMode";
import type { Profile } from "../hooks/useProfile";
import { translateAvatarLabel, translateBossRewardTitleById } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";
import IronButton from "./IronButton";

const GOAL_OPTIONS = ["mass_gain", "athletic", "runner", "fat_loss"] as const;
const EXPERIENCE_OPTIONS = ["beginner", "returning", "trained"] as const;
const WATCH_OPTIONS = ["apple_watch", "android_watch", "none"] as const;

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
  const { t } = useTranslation();
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [goal, setGoal] = useState(profile.goal);
  const [experience, setExperience] = useState(profile.experience);
  const [watchType, setWatchType] = useState(profile.watchType);
  const [avatarId, setAvatarId] = useState(profile.avatarId ?? "rookie");
  const [pathMode, setPathMode] = useState<PathMode>(
    getPathModeFromProfile(profile) ?? "balance"
  );
  const [pathChangeAck, setPathChangeAck] = useState(false);

  const currentPathMode = getPathModeFromProfile(profile) ?? "balance";
  const pathModeChanging = pathMode !== currentPathMode;

  const handleSave = () => {
    if (pathModeChanging && !pathChangeAck) {
      setPathChangeAck(true);
      return;
    }

    const nextProfile = normalizeProfilePath({
      ...profile,
      age,
      height,
      weight,
      goal,
      experience,
      watchType,
      avatarId,
      pathMode,
      classId: pathModeToClassId(pathMode),
      pathModeChangedAt: pathModeChanging
        ? new Date().toISOString()
        : profile.pathModeChangedAt,
    });

    onSave(nextProfile);
    onBack();
  };

  const inputClass =
    "w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] text-base";

  return (
    <ScreenShell
      eyebrow={t("profileScreen.eyebrow")}
      title={t("profileScreen.title")}
      subtitle={t("profileScreen.subtitle")}
      onBack={onBack}
    >
      <IronCard>
        <p className="uppercase text-xs font-bold tracking-widest mb-3">
          {t("profileScreen.avatar")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVATAR_OPTIONS.map((option) => {
            const locked = level < option.minLevel;
            const selected = avatarId === option.id;
            const label = translateAvatarLabel(option.id, option.label, t);

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
                  alt={label}
                  className="w-full h-20 object-cover border border-iron-border mb-2"
                />
                <p className="text-xs font-black uppercase">{label}</p>
                {locked && (
                  <p className="text-[10px] uppercase mt-1">
                    {t("common.levelShort", { level: option.minLevel })}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </IronCard>

      <IronCard variant="paper">
        <p className="uppercase text-xs font-bold tracking-widest mb-1">
          {t("profileScreen.pathMode")}
        </p>
        <p className="text-sm text-iron-muted mb-3">
          {t("profileScreen.pathModeCurrent", {
            mode: t(`pathMode.${currentPathMode}.title`),
          })}
        </p>
        {pathChangeAck && pathModeChanging && (
          <p className="text-sm text-iron-accent mb-3 border border-iron-accent-dim/40 p-3 rounded-sm">
            {t("profileScreen.pathModeChangeWarning")}
          </p>
        )}
        <div className="space-y-2">
          {PATH_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setPathMode(mode);
                setPathChangeAck(false);
              }}
              className={`w-full text-left border p-3 rounded-sm iron-interactive ${
                pathMode === mode
                  ? "border-iron-accent bg-iron-accent-dim/20"
                  : "border-iron-border iron-card-raised"
              }`}
            >
              <p className="font-bold text-sm">{t(`pathMode.${mode}.title`)}</p>
              <p className="text-xs text-iron-muted mt-1">
                {t(`pathMode.${mode}.description`)}
              </p>
            </button>
          ))}
        </div>
      </IronCard>

      <IronCard variant="dark">
        <p className="uppercase text-xs font-bold tracking-widest mb-3">
          {t("profileScreen.titleSection")}
        </p>
        {equippedTitle && (
          <p className="text-center text-lg font-semibold iron-text-accent mb-3">
            {translateBossRewardTitleById(equippedTitle, t)}
          </p>
        )}
        {unlockedTitleIds.length === 0 ? (
          <p className="text-xs uppercase text-center opacity-80">
            {t("profileScreen.noTitles")}
          </p>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onEquipTitle(null)}
              className={`w-full border border-iron-border p-2 uppercase text-xs font-bold ${
                !equippedTitle
                  ? "bg-iron-accent-dim text-iron-bg"
                  : "bg-transparent text-iron-text"
              }`}
            >
              {t("profileScreen.noTitle")}
            </button>
            {unlockedTitleIds.map((titleId) => (
              <button
                key={titleId}
                type="button"
                onClick={() => onEquipTitle(titleId)}
                className={`w-full border border-iron-border p-2 uppercase text-xs font-bold ${
                  equippedTitle === titleId
                    ? "bg-iron-accent-dim text-iron-bg"
                    : "bg-transparent text-iron-text"
                }`}
              >
                {translateBossRewardTitleById(titleId, t)}
              </button>
            ))}
          </div>
        )}
        {defeatedBadges.length > 0 && (
          <div className="mt-4 border-t border-iron-border pt-3">
            <p className="uppercase text-xs font-bold mb-2">
              {t("profileScreen.bossBadges")}
            </p>
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
            placeholder={t("onboarding.age")}
            className={inputClass}
          />
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={t("onboarding.height")}
            className={inputClass}
          />
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={t("onboarding.weight")}
            className={inputClass}
          />

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className={inputClass}
          >
            {GOAL_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`goal.${value}`)}
              </option>
            ))}
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className={inputClass}
          >
            {EXPERIENCE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`experience.${value}`)}
              </option>
            ))}
          </select>

          <select
            value={watchType}
            onChange={(e) => setWatchType(e.target.value)}
            className={inputClass}
          >
            {WATCH_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`watch.${value}`)}
              </option>
            ))}
          </select>
        </div>
      </IronCard>

      <IronButton onClick={handleSave}>
        {pathChangeAck && pathModeChanging
          ? t("profileScreen.pathModeConfirmChange")
          : t("profileScreen.save")}
      </IronButton>
    </ScreenShell>
  );
}
