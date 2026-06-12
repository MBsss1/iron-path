"use client";

import type { ActiveFitnessGoal } from "../data/fitnessGoals";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  goal: ActiveFitnessGoal | null;
  onClose: () => void;
};

export default function GoalDetailsModal({ goal, onClose }: Props) {
  const { t } = useTranslation();
  if (!goal) return null;

  const bullets = [0, 1, 2, 3, 4]
    .map((i) => t(`goal.details.${goal}.bullet${i}`))
    .filter((text) => text.length > 0 && !text.startsWith("goal.details."));

  return (
    <div
      className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="iron-modal iron-card-panel p-5 w-full max-w-sm max-h-[85vh] overflow-y-auto animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="iron-label">{t("goal.detailsLabel")}</p>
        <h3 className="iron-heading text-xl mt-2">{t(`goal.${goal}.title`)}</h3>
        <ul className="mt-4 space-y-2 text-sm text-iron-text leading-relaxed list-disc pl-5">
          {bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="iron-interactive w-full mt-6 py-3 text-sm font-semibold border border-iron-border rounded-sm"
        >
          {t("goal.detailsClose")}
        </button>
      </div>
    </div>
  );
}
