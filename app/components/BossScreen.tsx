"use client";

import {
  BOSS_TIERS,
  BOSSES,
  type BossDefinition,
} from "../data/bosses";
import {
  getBossProgressPercent,
  type BossProgressContext,
  type BossStatus,
} from "../utils/bossProgress";
import {
  translateBossBadge,
  translateBossDifficulty,
  translateBossField,
  translateBossLore,
  translateBossProgressLabel,
  translateBossRequirement,
  translateBossRewardTitle,
  translateBossTier,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronCard from "./IronCard";

type Props = {
  ctx: BossProgressContext;
  currentBoss: BossDefinition | null;
  getStatus: (boss: BossDefinition) => BossStatus;
  onClaimBoss: (bossId: BossDefinition["id"]) => void;
  onBack: () => void;
  defeatedCount: number;
  completionPercent: number;
};

function statusBadgeClass(status: BossStatus): string {
  switch (status) {
    case "defeated":
      return "border border-iron-danger/50 text-iron-danger bg-iron-panel";
    case "ready":
      return "border border-iron-danger text-iron-text bg-iron-panel";
    case "available":
      return "border border-iron-border-strong text-iron-text bg-iron-raised";
    default:
      return "border border-iron-border text-iron-muted bg-iron-panel";
  }
}

export default function BossScreen({
  ctx,
  currentBoss,
  getStatus,
  onClaimBoss,
  onBack,
  defeatedCount,
  completionPercent,
}: Props) {
  const { t } = useTranslation();

  const statusLabel = (status: BossStatus): string => {
    switch (status) {
      case "defeated":
        return t("boss.statusCleared");
      case "ready":
        return t("boss.statusReady");
      case "available":
        return t("boss.statusActive");
      default:
        return t("boss.statusLocked");
    }
  };

  return (
    <ScreenShell
      eyebrow={t("boss.eyebrow")}
      title={t("boss.title")}
      subtitle={t("boss.subtitle", {
        defeated: defeatedCount,
        total: BOSSES.length,
        percent: completionPercent,
      })}
      onBack={onBack}
    >
      <div className="iron-dossier p-4">
        <p className="iron-label text-iron-danger">{t("boss.activeTarget")}</p>
        {currentBoss ? (
          <>
            <h3 className="iron-heading text-2xl mt-1">
              {translateBossField(currentBoss, "name", t)}
            </h3>
            <p className="text-sm text-iron-muted mt-2 leading-relaxed">
              {translateBossField(currentBoss, "description", t)}
            </p>
            <p className="text-xs text-iron-muted mt-2 italic">
              &ldquo;{translateBossLore(currentBoss, t)}&rdquo;
            </p>
          </>
        ) : (
          <p className="text-sm text-iron-muted mt-2">{t("boss.allCleared")}</p>
        )}
        <div className="w-full h-2 iron-progress-track mt-4 overflow-hidden">
          <div
            className="h-full iron-progress-fill iron-progress-fill-danger"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {BOSS_TIERS.map(({ tier }) => {
        const tierBosses = BOSSES.filter((b) => b.tier === tier);

        return (
          <div key={tier}>
            <h3 className="iron-heading text-lg mb-3 border-b border-iron-border pb-2">
              {translateBossTier(tier, t)}
            </h3>

            <div className="space-y-3">
              {tierBosses.map((boss) => {
                const status = getStatus(boss);
                const isLocked = status === "locked";
                const isDefeated = status === "defeated";
                const isReady = status === "ready";
                const progressPercent = getBossProgressPercent(boss, ctx);
                const progressLabel = translateBossProgressLabel(boss, ctx, t);
                const requirementMet = progressPercent >= 100;

                return (
                  <IronCard
                    key={boss.id}
                    variant={isDefeated ? "tan" : isLocked ? "paper" : "dark"}
                    className={
                      isLocked
                        ? "opacity-75"
                        : isReady || status === "available"
                          ? "iron-dossier !p-4"
                          : ""
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-iron-muted">
                          {t("boss.tierMeta", {
                            tier: boss.tier,
                            level: boss.requiredLevel,
                            difficulty: translateBossDifficulty(boss.difficulty, t),
                          })}
                        </p>
                        <h4 className="iron-heading text-lg mt-1">
                          {translateBossField(boss, "name", t)}
                        </h4>
                        <p className="text-sm text-iron-muted mt-2 leading-relaxed">
                          {isLocked
                            ? t("boss.requiresLevel", { level: boss.requiredLevel })
                            : translateBossField(boss, "description", t)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 text-[10px] font-semibold tracking-wide ${statusBadgeClass(status)}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>

                    {!isLocked && !isDefeated && (
                      <div className="mt-4 border-t border-iron-border pt-3">
                        <p className="iron-label mb-2">{t("boss.requirements")}</p>
                        <p className="text-sm flex items-start gap-2">
                          <span className="text-iron-danger shrink-0">
                            {requirementMet ? "✓" : "□"}
                          </span>
                          <span>{translateBossRequirement(boss, t)}</span>
                        </p>
                        <p className="text-xs text-iron-muted mt-1 pl-5">{progressLabel}</p>
                        <div className="w-full h-2 iron-progress-track mt-2 overflow-hidden">
                          <div
                            className="h-full iron-progress-fill iron-progress-fill-danger"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="border border-iron-border p-2 iron-card-raised">
                        <p className="text-iron-accent-dim">{t("boss.rewardXp")}</p>
                        <p className="text-sm font-semibold mt-1 text-iron-accent">
                          +{boss.rewards.xp}
                        </p>
                      </div>
                      <div className="border border-iron-border p-2 iron-card-panel">
                        <p className="text-iron-muted">{t("boss.rewardTitleLabel")}</p>
                        <p className="text-sm font-semibold mt-1">
                          {translateBossRewardTitle(boss, t)}
                        </p>
                      </div>
                      <div className="border border-iron-border p-2 iron-card-raised">
                        <p className="text-iron-accent-dim">{t("boss.rewardBadge")}</p>
                        <p className="text-sm font-semibold mt-1">
                          {translateBossBadge(boss.rewards.badge, t)}
                        </p>
                      </div>
                    </div>

                    {isReady && (
                      <button
                        type="button"
                        onClick={() => onClaimBoss(boss.id)}
                        className="iron-interactive iron-btn-danger w-full mt-4 py-3 text-sm font-semibold rounded-sm"
                      >
                        {t("boss.fileClearance")}
                      </button>
                    )}
                  </IronCard>
                );
              })}
            </div>
          </div>
        );
      })}
    </ScreenShell>
  );
}
