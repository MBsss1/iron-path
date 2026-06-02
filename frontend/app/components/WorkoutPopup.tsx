"use client";

import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  xpReward: number;
  onClose: () => void;
};

export default function WorkoutPopup({ isOpen, xpReward, onClose }: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm animate-modal-enter">
        <h2 className="iron-heading text-2xl text-center">
          {t("popup.workout.title")}
        </h2>

        <div className="mt-6 text-center">
          <p className="text-2xl font-semibold iron-text-accent">
            {t("popup.workout.xp", { amount: xpReward })}
          </p>
          <p className="mt-2 text-sm text-iron-muted">{t("popup.workout.body")}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          {t("popup.workout.continue")}
        </button>
      </div>
    </div>
  );
}
