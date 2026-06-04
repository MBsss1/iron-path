"use client";

import type { ExerciseInfo } from "../data/exerciseLibrary";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  exercise: ExerciseInfo | null;
  isOpen: boolean;
  onClose: () => void;
};

type Lang = "en" | "ru";

function pickLang(locale: string): Lang {
  return locale === "ru" ? "ru" : "en";
}

export default function ExerciseDetailModal({ exercise, isOpen, onClose }: Props) {
  const { t, locale } = useTranslation();
  const lang = pickLang(locale);

  if (!isOpen || !exercise) return null;

  const categoryLabel = t(`exerciseLibrary.category.${exercise.category}`);
  const musclesLabel = exercise.muscles
    .map((m) => {
      const key = `exerciseLibrary.muscle.${m}`;
      const label = t(key);
      return label === key ? m : label;
    })
    .join(", ");

  const easier =
    exercise.easierVariant?.[lang] ?? t("exerciseLibrary.variantNone");
  const harder =
    exercise.harderVariant?.[lang] ?? t("exerciseLibrary.variantNone");

  return (
    <div
      className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-detail-title"
      onClick={onClose}
    >
      <div
        className="iron-modal p-5 sm:p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="iron-label text-iron-accent">{categoryLabel}</p>
        <h2 id="exercise-detail-title" className="iron-heading text-2xl mt-1">
          {exercise.name[lang]}
        </h2>

        <section className="mt-4">
          <p className="iron-label">{t("exerciseLibrary.description")}</p>
          <p className="mt-2 text-sm text-iron-text leading-relaxed">
            {exercise.description[lang]}
          </p>
        </section>

        <section className="mt-4">
          <p className="iron-label">{t("exerciseLibrary.muscles")}</p>
          <p className="mt-1.5 text-sm text-iron-muted">{musclesLabel}</p>
        </section>

        <section className="mt-4">
          <p className="iron-label">{t("exerciseLibrary.instructions")}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-iron-text list-disc pl-4">
            {exercise.instructions[lang].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4">
          <p className="iron-label">{t("exerciseLibrary.mistakes")}</p>
          <ul className="mt-2 space-y-1.5 text-sm text-iron-danger/90 list-disc pl-4">
            {exercise.mistakes[lang].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
          <div className="border border-iron-border p-3 rounded-sm iron-card-panel">
            <p className="iron-label">{t("exerciseLibrary.easier")}</p>
            <p className="mt-1 text-iron-text">{easier}</p>
          </div>
          <div className="border border-iron-border p-3 rounded-sm iron-card-panel">
            <p className="iron-label">{t("exerciseLibrary.harder")}</p>
            <p className="mt-1 text-iron-text">{harder}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          {t("exerciseLibrary.close")}
        </button>
      </div>
    </div>
  );
}
