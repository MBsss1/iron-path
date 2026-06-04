"use client";

import type { ReactNode } from "react";
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

function SectionCard({
  title,
  children,
  variant = "default",
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <section
      className={`border rounded-sm p-4 ${
        variant === "danger"
          ? "border-iron-danger/40 bg-iron-danger/5"
          : "border-iron-border iron-card-panel"
      }`}
    >
      <p className="iron-label">{title}</p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function ExerciseDetailModal({ exercise, isOpen, onClose }: Props) {
  const { t, locale } = useTranslation();
  const lang = pickLang(locale);

  if (!isOpen || !exercise) return null;

  const musclesLabel = exercise.muscles
    .map((m) => {
      const key = `exerciseLibrary.muscle.${m}`;
      const label = t(key);
      return label === key ? m : label;
    })
    .join(", ");

  const instructions = exercise.instructions[lang];
  const mistakes = exercise.mistakes[lang].slice(0, 4);
  const imageSrc = exercise.imageUrl;

  return (
    <div
      className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-detail-title"
      onClick={onClose}
    >
      <div
        className="iron-modal p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {imageSrc && (
          <div className="mb-4 rounded-sm overflow-hidden border border-iron-border">
            <img
              src={imageSrc}
              alt=""
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        <p className="iron-label text-iron-accent">
          {t(`exerciseLibrary.category.${exercise.category}`)}
        </p>
        <h2 id="exercise-detail-title" className="iron-heading text-2xl mt-1">
          {exercise.name[lang]}
        </h2>

        <div className="mt-4 space-y-3">
          <SectionCard title={t("exerciseLibrary.sectionWhy")}>
            <p className="text-sm text-iron-text leading-relaxed">
              {exercise.description[lang]}
            </p>
          </SectionCard>

          <SectionCard title={t("exerciseLibrary.sectionMuscles")}>
            <p className="text-sm text-iron-muted leading-relaxed">{musclesLabel}</p>
          </SectionCard>

          <SectionCard title={t("exerciseLibrary.sectionHow")}>
            <ol className="space-y-2 text-sm text-iron-text list-none p-0 m-0">
              {instructions.map((line, index) => (
                <li key={line} className="flex gap-3 leading-relaxed">
                  <span className="shrink-0 font-semibold text-iron-accent tabular-nums">
                    {index + 1}.
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </SectionCard>

          {mistakes.length > 0 && (
            <SectionCard title={t("exerciseLibrary.sectionMistakes")} variant="danger">
              <ul className="space-y-2 text-sm text-iron-danger/95 list-none p-0 m-0">
                {mistakes.map((line) => (
                  <li key={line} className="flex gap-2 leading-relaxed">
                    <span className="shrink-0" aria-hidden="true">
                      !
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {exercise.easierVariant && (
            <SectionCard title={t("exerciseLibrary.sectionEasier")}>
              <p className="text-sm text-iron-text">{exercise.easierVariant[lang]}</p>
            </SectionCard>
          )}

          {exercise.harderVariant && (
            <SectionCard title={t("exerciseLibrary.sectionHarder")}>
              <p className="text-sm text-iron-text">{exercise.harderVariant[lang]}</p>
            </SectionCard>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-5 py-3 text-sm font-semibold rounded-sm"
        >
          {t("exerciseLibrary.close")}
        </button>
      </div>
    </div>
  );
}
