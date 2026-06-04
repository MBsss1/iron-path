"use client";

import { useState } from "react";
import type { TranslationParams } from "../i18n";
import { useTranslation } from "../i18n/useTranslation";
import type { ActiveFitnessGoal } from "../data/fitnessGoals";
import type { Profile } from "../hooks/useProfile";
import GoalSelectionCards from "./GoalSelectionCards";

type TFn = (key: string, params?: TranslationParams) => string;

type Props = {
  onFinish: (profile: Profile) => void;
};

type FieldErrors = {
  age?: string;
  height?: string;
  weight?: string;
};

const EXPERIENCE_OPTIONS = ["beginner", "returning", "trained"] as const;
const WATCH_OPTIONS = ["apple_watch", "android_watch", "none"] as const;

function parseWholeNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

function validateAge(value: string, t: TFn): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return t("onboarding.errors.ageRequired");
  const n = parseWholeNumber(value);
  if (n === null || n < 13 || n > 100) return t("onboarding.errors.ageRange");
  return undefined;
}

function validateHeight(value: string, t: TFn): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return t("onboarding.errors.heightRequired");
  const n = parseWholeNumber(value);
  if (n === null || n < 100 || n > 250) return t("onboarding.errors.heightRange");
  return undefined;
}

function validateWeight(value: string, t: TFn): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return t("onboarding.errors.weightRequired");
  const n = parseWholeNumber(value);
  if (n === null || n < 30 || n > 250) return t("onboarding.errors.weightRange");
  return undefined;
}

function validateAll(
  age: string,
  height: string,
  weight: string,
  t: TFn
): FieldErrors {
  return {
    age: validateAge(age, t),
    height: validateHeight(height, t),
    weight: validateWeight(weight, t),
  };
}

function hasErrors(errors: FieldErrors): boolean {
  return Boolean(errors.age || errors.height || errors.weight);
}

export default function OnboardingScreen({ onFinish }: Props) {
  const { t } = useTranslation();
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<ActiveFitnessGoal>("mass_gain");
  const [experience, setExperience] = useState<string>("returning");
  const [watchType, setWatchType] = useState<string>("none");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const inputClass = (field: keyof FieldErrors) =>
    `w-full border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm ${
      showErrors && errors[field]
        ? "border-iron-danger"
        : "border-iron-border"
    }`;

  const updateField = (
    field: keyof FieldErrors,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value);
    if (showErrors) {
      setErrors((prev) => {
        const next = { ...prev };
        if (field === "age") next.age = validateAge(value, t);
        if (field === "height") next.height = validateHeight(value, t);
        if (field === "weight") next.weight = validateWeight(value, t);
        return next;
      });
    }
  };

  const saveProfile = () => {
    const nextErrors = validateAll(age, height, weight, t);
    setShowErrors(true);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    onFinish({
      age: age.trim(),
      height: height.trim(),
      weight: weight.trim(),
      goal,
      experience,
      watchType,
      avatarId: "rookie",
    });
  };

  const optionClass = (selected: boolean) =>
    `border border-iron-border p-3 font-semibold rounded-sm ${
      selected
        ? "bg-iron-accent-dim text-iron-bg border-iron-accent"
        : "iron-card-raised text-iron-text"
    }`;

  const renderField = (
    id: keyof FieldErrors,
    value: string,
    onChange: (value: string) => void,
    placeholderKey: "onboarding.age" | "onboarding.height" | "onboarding.weight"
  ) => (
    <div>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => updateField(id, e.target.value, onChange)}
        placeholder={t(placeholderKey)}
        className={inputClass(id)}
        aria-invalid={showErrors && Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {showErrors && errors[id] && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-iron-danger">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <h2 className="iron-heading text-3xl text-center">{t("onboarding.welcome")}</h2>
      <p className="text-center text-sm mt-2 text-iron-muted">
        {t("onboarding.subtitle")}
      </p>

      <div className="mt-8 space-y-4">
        {renderField("age", age, setAge, "onboarding.age")}
        {renderField("height", height, setHeight, "onboarding.height")}
        {renderField("weight", weight, setWeight, "onboarding.weight")}
      </div>

      <div className="mt-6">
        <h3 className="iron-heading text-lg">{t("onboarding.goal")}</h3>
        <div className="mt-3">
          <GoalSelectionCards selected={goal} onSelect={setGoal} />
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
