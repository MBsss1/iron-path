"use client";

import type { SeasonRecord } from "../../hooks/useSeasons";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  seasons: SeasonRecord[];
};

export default function ProgressSeasonsSection({ seasons }: Props) {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "ru" ? "ru-RU" : "en-US";

  if (seasons.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-iron-muted leading-relaxed">
          {t("progressScreen.historyEmpty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase font-bold text-iron-gold">
        {t("progressScreen.historyEvents")}
      </p>
      <div className="space-y-3">
      {seasons.map((s) => (
        <div key={s.id} className="border border-iron-border p-4 iron-card-panel">
          <div className="flex justify-between gap-4">
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
      </div>
    </div>
  );
}
