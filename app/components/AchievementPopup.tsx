"use client";

import { AchievementDefinition } from "../data/achievements";
import { translateAchievement } from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  achievement: AchievementDefinition | null;
  onClose: () => void;
};

export default function AchievementPopup({
  isOpen,
  achievement,
  onClose,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in">
      <div className="iron-modal p-6 w-full max-w-sm text-center animate-modal-enter">
        <p className="iron-label">{t("popup.achievement.eyebrow")}</p>

        <h2 className="iron-heading text-3xl mt-4">
          {translateAchievement(achievement.id, "title", achievement.title, t)}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-iron-muted">
          {translateAchievement(
            achievement.id,
            "description",
            achievement.description,
            t
          )}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="iron-interactive iron-btn-primary w-full mt-6 py-3 text-sm font-semibold rounded-sm"
        >
          {t("popup.achievement.continue")}
        </button>
      </div>
    </div>
  );
}
