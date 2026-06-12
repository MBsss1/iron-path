"use client";

import type { Locale } from "../i18n";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onSelect: (locale: Locale) => void;
};

export default function LanguageSelectionScreen({ onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[98] flex items-center justify-center iron-page px-4">
      <div className="w-full max-w-sm iron-shell-card p-6 text-center">
        <p className="iron-label">{t("app.title")}</p>
        <p className="mt-2 text-sm text-iron-muted">{t("app.tagline")}</p>

        <h1 className="iron-heading text-xl mt-6">{t("lang.selectTitle")}</h1>
        <p className="mt-1 text-sm text-iron-muted">{t("lang.selectSubtitle")}</p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("ru")}
            className="iron-interactive iron-btn-primary w-full py-4 text-base font-semibold rounded-sm"
          >
            🇷🇺 {t("lang.russian")}
          </button>
          <button
            type="button"
            onClick={() => onSelect("en")}
            className="iron-interactive iron-btn-secondary w-full py-4 text-base font-semibold rounded-sm"
          >
            🇺🇸 {t("lang.english")}
          </button>
        </div>
      </div>
    </div>
  );
}
