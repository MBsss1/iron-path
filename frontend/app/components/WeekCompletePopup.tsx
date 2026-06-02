"use client";

import { translatePhase } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  week: number;
  phase: string;
  onClose: () => void;
};

export default function WeekCompletePopup({
  isOpen,
  week,
  phase,
  onClose,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const phaseLabel = translatePhase(phase, t);

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm text-center animate-modal-enter border border-iron-gold-dim/40">
        <p className="iron-label">{t("popup.weekComplete.eyebrow")}</p>

        <h2 className="iron-heading text-4xl mt-3">
          {t("popup.weekComplete.week", { week })}
        </h2>

        <p className="mt-3 text-lg font-semibold iron-text-accent">{phaseLabel}</p>

        <p className="mt-6 text-sm leading-relaxed text-iron-muted">
          {t("popup.weekComplete.message")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
        >
          {t("popup.weekComplete.continue")}
        </button>
      </div>
    </div>
  );
}
