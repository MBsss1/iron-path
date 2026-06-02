"use client";

import { useState } from "react";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onFinish: () => void;
};

const GOAL_OPTIONS = ["mass_gain", "athletic", "runner", "fat_loss"] as const;
const EXPERIENCE_OPTIONS = ["beginner", "returning", "trained"] as const;
const WATCH_OPTIONS = ["apple_watch", "android_watch", "none"] as const;

export default function OnboardingScreen({ onFinish }: Props) {
  const { t } = useTranslation();
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<string>("mass_gain");
  const [experience, setExperience] = useState<string>("returning");
  const [watchType, setWatchType] = useState<string>("none");

  const saveProfile = () => {
    localStorage.setItem(
      STORAGE_KEYS.profile,
      JSON.stringify({
        age,
        height,
        weight,
        goal,
        experience,
        watchType,
      })
    );
    onFinish();
  };

  const inputClass =
    "w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm";

  const optionClass = (selected: boolean) =>
    `border border-iron-border p-3 font-semibold rounded-sm ${
      selected
        ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
        : "iron-card-raised text-iron-text"
    }`;

  return (
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <h2 className="iron-heading text-3xl text-center">{t("onboarding.welcome")}</h2>
      <p className="text-center text-sm mt-2 text-iron-muted">
        {t("onboarding.subtitle")}
      </p>

      <div className="mt-8 space-y-4">
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
      </div>

      <div className="mt-6">
        <h3 className="iron-heading text-lg">{t("onboarding.goal")}</h3>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {GOAL_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGoal(value)}
              className={optionClass(goal === value)}
            >
              {t(`goal.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="iron-heading text-lg">{t("onboarding.experience")}</h3>
        <div className="grid grid-cols-1 gap-3 mt-3">
          {EXPERIENCE_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setExperience(value)}
              className={optionClass(experience === value)}
            >
              {t(`experience.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="iron-heading text-lg">{t("onboarding.smartwatch")}</h3>
        <div className="grid grid-cols-1 gap-3 mt-3">
          {WATCH_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setWatchType(value)}
              className={optionClass(watchType === value)}
            >
              {t(`watch.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={saveProfile}
        className="w-full mt-8 iron-interactive iron-btn-primary py-4 text-sm font-semibold rounded-sm"
      >
        {t("onboarding.beginJourney")}
      </button>
    </div>
  );
}
