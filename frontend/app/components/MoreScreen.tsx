<<<<<<< HEAD
"use client";

import ShareProgressCard from "./ShareProgressCard";
import { useTranslation } from "../i18n/useTranslation";

=======
>>>>>>> 552e347 (clean up first launch and more screen)
type Props = {
  onSelectProfile: () => void;
  onSelectProgress: () => void;
<<<<<<< HEAD
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
=======
  onSelectStages: () => void;
  onSelectSettings: () => void;
>>>>>>> 552e347 (clean up first launch and more screen)
};

const menuBtn =
  "iron-interactive w-full border p-5 sm:p-6 min-h-[48px] text-left hover:border-iron-gold-dim/50 rounded-sm";

export default function MoreScreen({
<<<<<<< HEAD
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
=======
  onSelectProfile,
  onSelectProgress,
  onSelectStages,
  onSelectSettings,
>>>>>>> 552e347 (clean up first launch and more screen)
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
<<<<<<< HEAD
        <p className="iron-label">{t("more.menu")}</p>
        <h2 className="iron-heading text-3xl mt-2">{t("more.title")}</h2>
        <p className="mt-2 text-sm text-iron-muted">{t("more.subtitle")}</p>
=======
        <p className="uppercase tracking-[0.2em] text-sm font-bold">Menu</p>
        <h2 className="text-4xl font-black uppercase mt-2">More</h2>
        <p className="mt-2 uppercase text-sm">
          Profile, progress, and settings
        </p>
>>>>>>> 552e347 (clean up first launch and more screen)
      </div>

      <div className="mt-8 space-y-4">
<<<<<<< HEAD
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
=======
        <button
          onClick={onSelectProfile}
          className="w-full border-4 border-black p-5 sm:p-6 bg-[#e8d8b0] hover:bg-[#d4c89a] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            Identity
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            Profile
          </h3>
          <p className="mt-3 text-sm uppercase text-black">
            Avatar, class, and training goal
          </p>
        </button>

        <button
          onClick={onSelectProgress}
          className="w-full border-4 border-black p-5 sm:p-6 bg-black text-[#efe3c2] hover:bg-[#333] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            Journey
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            Progress
          </h3>
          <p className="mt-3 text-sm uppercase">
            Level, week, phase, and XP milestones
          </p>
        </button>

        <button
          onClick={onSelectStages}
          className="w-full border-4 border-black p-5 sm:p-6 bg-[#efe3c2] hover:bg-[#e6dcc0] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            Milestones
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            Stages
          </h3>
          <p className="mt-3 text-sm uppercase text-black">
            Achievements and path milestones
          </p>
        </button>

        <button
          onClick={onSelectSettings}
          className="w-full border-4 border-black p-5 sm:p-6 bg-black text-[#efe3c2] hover:bg-[#333] transition-colors min-h-[48px]"
        >
          <p className="uppercase tracking-[0.2em] text-sm font-bold">
            App
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase mt-3">
            Settings
          </h3>
          <p className="mt-3 text-sm uppercase">
            Reset progress and manage your data
          </p>
        </button>
>>>>>>> 552e347 (clean up first launch and more screen)
      </div>
    </div>
  );
}
