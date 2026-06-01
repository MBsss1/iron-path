"use client";

import {
  BOSS_TIERS,
  BOSSES,
  type BossDefinition,
} from "../data/bosses";
import {
  getBossProgressLabel,
  getBossProgressPercent,
  type BossProgressContext,
  type BossStatus,
} from "../utils/bossProgress";
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

function statusLabel(status: BossStatus): string {
  switch (status) {
    case "defeated":
      return "Defeated";
    case "ready":
      return "Ready";
    case "available":
      return "Active";
    default:
      return "Locked";
  }
}

function statusBadgeClass(status: BossStatus): string {
  switch (status) {
    case "defeated":
      return "bg-[#b22222] text-[#efe3c2]";
    case "ready":
      return "bg-black text-[#efe3c2] border-[#b22222]";
    case "available":
      return "bg-[#e8d8b0] text-black";
    default:
      return "bg-gray-400 text-gray-700";
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
  return (
    <ScreenShell
      eyebrow="Inner War"
      title="Boss Trials"
      subtitle={`${defeatedCount} / ${BOSSES.length} defeated · ${completionPercent}% complete`}
      onBack={onBack}
    >
      <IronCard variant="dark">
        <p className="uppercase text-xs font-bold text-center tracking-widest">
          Current Foe
        </p>
        {currentBoss ? (
          <>
            <h3 className="text-3xl font-black uppercase text-center mt-2 text-[#b22222]">
              {currentBoss.name}
            </h3>
            <p className="text-xs uppercase text-center mt-2 leading-relaxed opacity-90">
              {currentBoss.description}
            </p>
            <p className="text-[10px] uppercase text-center mt-3 italic opacity-70">
              &ldquo;{currentBoss.lore}&rdquo;
            </p>
          </>
        ) : (
          <p className="text-lg font-black uppercase text-center mt-2">
            All bosses defeated
          </p>
        )}
        <div className="w-full h-4 border-2 border-[#efe3c2] mt-4">
          <div
            className="h-full bg-[#b22222] transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </IronCard>

      {BOSS_TIERS.map(({ tier, label }) => {
        const tierBosses = BOSSES.filter((b) => b.tier === tier);

        return (
          <div key={tier}>
            <h3 className="text-xl font-black uppercase mb-3 border-b-4 border-black pb-2">
              {label}
            </h3>

            <div className="space-y-3">
              {tierBosses.map((boss) => {
                const status = getStatus(boss);
                const isLocked = status === "locked";
                const isDefeated = status === "defeated";
                const isReady = status === "ready";
                const progressPercent = getBossProgressPercent(boss, ctx);
                const progressLabel = getBossProgressLabel(boss, ctx);

                return (
                  <IronCard
                    key={boss.id}
                    variant={isDefeated ? "tan" : isLocked ? "paper" : "dark"}
                    className={isLocked ? "opacity-75" : ""}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                          Tier {boss.tier} · Lv {boss.requiredLevel} ·{" "}
                          {boss.difficulty}
                        </p>
                        <h4 className="text-xl font-black uppercase mt-1">
                          {boss.name}
                        </h4>
                        <p className="text-xs uppercase mt-2 leading-relaxed">
                          {isLocked
                            ? `Requires level ${boss.requiredLevel} and prior boss defeated.`
                            : boss.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 px-2 py-1 border-2 border-black text-[10px] font-black uppercase ${statusBadgeClass(status)}`}
                      >
                        {statusLabel(status)}
                      </span>
                    </div>

                    {!isLocked && !isDefeated && (
                      <div className="mt-4 border-2 border-black p-3 bg-[#f5ead0] text-black">
                        <p className="text-xs font-black uppercase">
                          Requirement
                        </p>
                        <p className="text-sm uppercase font-bold mt-1">
                          {boss.requirement.label}
                        </p>
                        <div className="flex justify-between uppercase text-xs font-bold mt-3">
                          <span>Progress</span>
                          <span>{progressLabel}</span>
                        </div>
                        <div className="w-full h-3 border-2 border-black mt-2 bg-[#efe3c2]">
                          <div
                            className="h-full bg-[#b22222] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center uppercase text-[10px] font-bold">
                      <div className="border-2 border-black p-2 bg-[#e8d8b0]">
                        <p>XP</p>
                        <p className="text-sm font-black mt-1 text-[#b22222]">
                          +{boss.rewards.xp}
                        </p>
                      </div>
                      <div className="border-2 border-black p-2 bg-black text-[#efe3c2]">
                        <p>Title</p>
                        <p className="text-sm font-black mt-1">
                          {boss.rewards.title}
                        </p>
                      </div>
                      <div className="border-2 border-black p-2 bg-[#e8d8b0]">
                        <p>Badge</p>
                        <p className="text-sm font-black mt-1">
                          {boss.rewards.badge.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>

                    {isReady && (
                      <button
                        type="button"
                        onClick={() => onClaimBoss(boss.id)}
                        className="w-full mt-4 bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black transition-transform active:scale-[0.98]"
                      >
                        Claim Victory
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
