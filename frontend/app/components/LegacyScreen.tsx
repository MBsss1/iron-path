"use client";

import { SeasonRecord } from "../hooks/useSeasons";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";

type Props = {
  seasons: SeasonRecord[];
  onBack: () => void;
};

export default function LegacyScreen({ seasons, onBack }: Props) {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "ru" ? "ru-RU" : "en-US";

  return (
    <ScreenShell
      eyebrow={t("legacyScreen.eyebrow")}
      title={t("legacyScreen.title")}
      subtitle={t("legacyScreen.subtitle")}
      onBack={onBack}
    >
      {seasons.length === 0 && (
        <div className="border border-iron-border p-4 iron-card-raised text-center">
          <p className="uppercase font-black text-iron-text">
            {t("legacyScreen.empty")}
          </p>
        </div>
      )}

      {seasons.map((s) => (
        <div key={s.id} className="border border-iron-border p-4 iron-card-panel">
          <div className="flex justify-between">
            <div>
              <p className="uppercase text-xs text-iron-gold">
                {t("legacyScreen.season", { id: s.id })}
              </p>
              <p className="font-black text-lg mt-1 text-iron-cream">
                {t("legacyScreen.completed", {
                  date: new Date(s.completedAt).toLocaleDateString(dateLocale),
                })}
              </p>
            </div>

            <div className="text-right">
              <p className="uppercase text-xs text-iron-gold">
                {t("legacyScreen.week")}
              </p>
              <p className="font-black text-lg mt-1 text-iron-cream">{s.week}</p>
              <p className="uppercase text-xs mt-2 text-iron-gold">
                {t("legacyScreen.level")}
              </p>
              <p className="font-black text-iron-cream">
                {s.levelAtCompletion ?? "—"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </ScreenShell>
  );
}
