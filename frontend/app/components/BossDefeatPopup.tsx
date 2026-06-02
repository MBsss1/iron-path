"use client";

import type { BossDefinition } from "../data/bosses";
import { translateBossField } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  boss: BossDefinition | null;
  xpReward: number;
  onClose: () => void;
};

export default function BossDefeatPopup({
  isOpen,
  boss,
  xpReward,
  onClose,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen || !boss) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal iron-dossier p-6 w-full max-w-sm text-center animate-modal-enter">
        <p className="iron-label text-iron-danger">{t("popup.bossDefeat.eyebrow")}</p>

        <h2 className="iron-heading text-3xl mt-3">
          {translateBossField(boss, "name", t)}
        </h2>

        <div className="mt-6 iron-card-panel p-4 space-y-3 text-left">
          <div>
            <p className="iron-label">{t("popup.bossDefeat.xpLabel")}</p>
            <p className="text-2xl font-semibold iron-text-accent mt-1">
              {t("popup.bossDefeat.xp", { amount: xpReward })}
            </p>
          </div>

          <div className="border-t border-iron-border pt-3">
            <p className="iron-label">{t("popup.bossDefeat.titleEarned")}</p>
            <p className="text-xl font-semibold mt-1">{boss.rewards.title}</p>
          </div>

          <div className="border-t border-iron-border pt-3">
            <p className="iron-label">{t("popup.bossDefeat.badge")}</p>
            <p className="text-base font-semibold mt-1">
              {boss.rewards.badge.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          {t("popup.bossDefeat.continue")}
        </button>
      </div>
    </div>
  );
}
