"use client";

import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  onAction?: () => void;
  actionLabel?: string;
};

export default function StreakWarningCard({ onAction, actionLabel }: Props) {
  const { t } = useTranslation();

  return (
    <div className="iron-streak-warning-card p-3.5 space-y-2">
      <p className="text-sm font-semibold text-iron-text">
        {t("playerRank.streakWarningTitle")}
      </p>
      <p className="text-sm text-iron-muted leading-relaxed">
        {t("playerRank.streakWarningBody")}
      </p>
      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="iron-interactive w-full mt-1 py-2.5 text-xs font-semibold rounded-sm border border-iron-accent-dim text-iron-accent hover:text-iron-text"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
