"use client";

import ShareProgressCard from "./ShareProgressCard";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onSelectProgress: () => void;
  onSelectBosses?: () => void;
  onSelectSettings?: () => void;
  onSelectProfile?: () => void;
  level: number;
  rank: string;
  week: number;
  phase: string;
  streak: number;
  body: number;
  mind: number;
  work: number;
  equippedTitle?: string | null;
};

const menuBtn =
  "iron-interactive w-full border p-5 sm:p-6 min-h-[48px] text-left hover:border-iron-gold-dim/50 rounded-sm";

export default function MoreScreen({
  onSelectProgress,
  onSelectBosses,
  onSelectSettings,
  onSelectProfile,
  level,
  rank,
  week,
  phase,
  streak,
  body,
  mind,
  work,
  equippedTitle,
}: Props) {
  const { t } = useTranslation();

  const cards = [
    {
      onClick: onSelectProfile,
      className: "iron-card-raised border-iron-border text-iron-text",
      label: t("more.profile.label"),
      title: t("more.profile.title"),
      desc: t("more.profile.desc"),
    },
    {
      onClick: onSelectProgress,
      className: "iron-card-panel border-iron-border-strong text-iron-text",
      label: t("more.progress.label"),
      title: t("more.progress.title"),
      desc: t("more.progress.desc"),
    },
    {
      onClick: onSelectBosses,
      className: "iron-dossier text-iron-text",
      label: t("more.milestones.label"),
      title: t("more.milestones.title"),
      desc: t("more.milestones.desc"),
    },
    {
      onClick: onSelectSettings,
      className: "iron-card-panel border-iron-border text-iron-text",
      label: t("more.settings.label"),
      title: t("more.settings.title"),
      desc: t("more.settings.desc"),
    },
  ] as const;

  return (
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <div className="text-center">
        <p className="iron-label">{t("more.menu")}</p>
        <h2 className="iron-heading text-3xl mt-2">{t("more.title")}</h2>
        <p className="mt-2 text-sm text-iron-muted">{t("more.subtitle")}</p>
      </div>

      <div className="mt-8">
        <ShareProgressCard
          level={level}
          rank={rank}
          week={week}
          phase={phase}
          streak={streak}
          body={body}
          mind={mind}
          work={work}
          equippedTitle={equippedTitle}
        />
      </div>

      <div className="mt-8 space-y-4">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={`${menuBtn} ${card.className}`}
          >
            <p className="text-sm font-bold text-iron-accent-dim">{card.label}</p>
            <h3 className="iron-heading text-xl mt-2">{card.title}</h3>
            <p className="mt-2 text-sm text-iron-muted">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
