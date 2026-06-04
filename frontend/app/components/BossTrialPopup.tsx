"use client";

import { BossTrial } from "../data/bossTrials";
import {
  translateBossTrialField,
  translateBossTrialRequirement,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  trial: BossTrial | null;
  onComplete: () => void;
  onSkip?: () => void;
};

export default function BossTrialPopup({
  isOpen,
  trial,
  onComplete,
  onSkip,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen || !trial) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal iron-dossier p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-modal-enter">
        <div className="border-b border-iron-border pb-4 mb-4">
          <p className="iron-label text-iron-danger">{t("popup.bossTrial.eyebrow")}</p>
          <h2 className="iron-heading text-2xl mt-2">
            {translateBossTrialField(trial.id, "title", trial, t)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-iron-muted">
            {translateBossTrialField(trial.id, "description", trial, t)}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="iron-heading text-base mb-3">
            {t("popup.bossTrial.requirements")}
          </h3>
          <div className="space-y-2 border border-iron-border p-3 iron-card-panel">
            {trial.requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-iron-danger shrink-0">□</span>
                <p>{translateBossTrialRequirement(trial.id, index, req, t)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 border border-iron-border p-4 iron-card-raised text-center">
          <p className="iron-label">{t("popup.bossTrial.reward")}</p>
          <p className="text-3xl font-semibold iron-text-accent mt-2">
            {t("popup.dailyReward.xp", { amount: trial.xpReward })}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 iron-interactive iron-btn-danger py-3 text-sm font-semibold rounded-sm"
          >
            {t("popup.bossTrial.accept")}
          </button>

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm"
            >
              {t("popup.bossTrial.skip")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
