"use client";

import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  level: number;
  rank: string;
  onClose: () => void;
};

export default function LevelUpPopup({ isOpen, level, rank, onClose }: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm text-center animate-modal-enter border border-iron-border-strong">
        <p className="iron-label">{t("popup.levelUp.eyebrow")}</p>

        <h2 className="iron-heading text-5xl mt-3">
          {t("popup.levelUp.level", { level })}
        </h2>

        <p className="mt-3 text-xl font-semibold iron-text-accent">{rank}</p>

        <p className="mt-6 text-sm leading-relaxed text-iron-muted">
          {t("popup.levelUp.message")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          {t("popup.levelUp.continue")}
        </button>
      </div>
    </div>
  );
}
