"use client";

import { SeasonRecord } from "../hooks/useSeasons";
import { useTranslation } from "../i18n/useTranslation";

type Rewards = {
  xp: number;
  body: number;
  mind: number;
  work: number;
  badge?: string;
};

type Props = {
  isOpen: boolean;
  season?: SeasonRecord | null;
  rewards: Rewards;
  isClaimed?: boolean;
  onClaim: () => void;
  onClose?: () => void;
};

export default function SeasonCompletePopup({
  isOpen,
  rewards,
  isClaimed,
  onClaim,
  onClose,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="iron-modal border border-iron-gold-dim/40 p-6 w-full max-w-md text-center">
        <p className="iron-label">{t("popup.seasonComplete.eyebrow")}</p>
        <h2 className="iron-heading text-3xl mt-3">{t("popup.seasonComplete.title")}</h2>

        <p className="mt-4 text-sm leading-relaxed text-iron-muted">
          {t("popup.seasonComplete.message")}
        </p>

        <div className="mt-6 border border-iron-border p-4 iron-card-panel">
          <p className="text-xs text-iron-accent">{t("popup.seasonComplete.rewards")}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-left">
            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs text-iron-muted">{t("common.xp")}</p>
              <p className="font-semibold text-lg mt-1">+{rewards.xp}</p>
            </div>
            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs text-iron-muted">{t("stat.body")}</p>
              <p className="font-semibold text-lg mt-1">+{rewards.body}</p>
            </div>
            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs text-iron-muted">{t("stat.mind")}</p>
              <p className="font-semibold text-lg mt-1">+{rewards.mind}</p>
            </div>
            <div className="border border-iron-border p-3 iron-card-raised">
              <p className="text-xs text-iron-muted">{t("stat.work")}</p>
              <p className="font-semibold text-lg mt-1">+{rewards.work}</p>
            </div>
          </div>

          {rewards.badge && (
            <div className="mt-4 border border-iron-border-strong p-3 bg-iron-raised text-center">
              <p className="text-xs text-iron-muted">
                {t("popup.seasonComplete.legacyBadge")}
              </p>
              <p className="font-semibold mt-1">{rewards.badge}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClaim}
            disabled={isClaimed}
            className={`flex-1 border py-3 text-sm font-semibold rounded-sm ${
              isClaimed
                ? "bg-iron-charcoal text-iron-muted border-iron-border"
                : "iron-interactive iron-btn-primary"
            }`}
          >
            {isClaimed
              ? t("popup.seasonComplete.claimed")
              : t("popup.seasonComplete.claim")}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm"
            >
              {t("popup.seasonComplete.later")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
