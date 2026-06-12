"use client";

import { useState } from "react";
import type { Locale } from "../i18n";
import { getLocaleLabel } from "../i18n";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onBack: () => void;
  onReset: () => void;
};

export default function SettingsScreen({ onBack, onReset }: Props) {
  const { t, locale, setLocale } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setConfirming(false);
  };

  const handleLanguageChange = (next: Locale) => {
    setLocale(next);
  };

  return (
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <button
        type="button"
        onClick={onBack}
        className="iron-interactive -ml-1 mb-3 text-sm text-iron-muted hover:text-iron-text font-medium"
      >
        ← {t("common.back")}
      </button>

      <div className="text-center">
        <p className="iron-label">{t("settings.options")}</p>
        <h2 className="iron-heading text-3xl mt-2">{t("settings.title")}</h2>
        <p className="mt-2 text-sm text-iron-muted">{t("settings.subtitle")}</p>
      </div>

      <div className="mt-8 border border-iron-border iron-card-raised p-5">
        <p className="iron-label">{t("settings.language")}</p>
        <p className="mt-2 text-sm text-iron-muted">
          {t("settings.languageCurrent", { language: getLocaleLabel(locale) })}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleLanguageChange("ru")}
            className={`iron-interactive py-3 text-sm font-semibold rounded-sm ${
              locale === "ru" ? "iron-btn-primary" : "iron-btn-secondary"
            }`}
          >
            {t("settings.languageRussian")}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            className={`iron-interactive py-3 text-sm font-semibold rounded-sm ${
              locale === "en" ? "iron-btn-primary" : "iron-btn-secondary"
            }`}
          >
            {t("settings.languageEnglish")}
          </button>
        </div>
      </div>

      <div className="mt-8 border border-iron-border-strong iron-card-raised p-5">
        <p className="iron-label text-iron-danger">{t("settings.dangerZone")}</p>

        <h3 className="iron-heading text-xl mt-3">{t("settings.resetProgress")}</h3>

        <p className="mt-3 text-sm leading-relaxed text-iron-muted">
          {t("settings.resetDescription")}
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full mt-5 iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm border-iron-danger"
          >
            {t("settings.resetButton")}
          </button>
        ) : (
          <div className="mt-5 border border-iron-border iron-card-panel p-4">
            <p className="text-sm font-semibold text-center text-iron-text">
              {t("settings.confirmText")}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm"
              >
                {t("settings.cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="iron-interactive iron-btn-danger py-3 text-sm font-semibold rounded-sm"
              >
                {t("settings.confirmReset")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
