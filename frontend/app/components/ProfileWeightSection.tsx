"use client";

import { useEffect, useState } from "react";
import AnimatedProgressFill from "../animations/AnimatedProgressFill";
import { useWeightProgress } from "../hooks/useWeightProgress";
import { useTranslation } from "../i18n/useTranslation";
import { track } from "../utils/analytics";

export default function ProfileWeightSection() {
  const { t } = useTranslation();
  const { data, updateWeight, setTargetWeight } = useWeightProgress();
  const [modalOpen, setModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    if (!modalOpen || !data) return;
    setWeightInput(String(data.currentWeight));
    setGoalInput(String(data.targetWeight));
  }, [modalOpen, data]);

  if (!data) {
    return (
      <div className="iron-card-panel p-4 text-center text-sm text-iron-muted">
        {t("playerWeight.loading")}
      </div>
    );
  }

  const diffToGoal = Math.abs(data.targetWeight - data.currentWeight);
  const totalSpan = Math.abs(data.targetWeight - data.startWeight);
  const traveled = Math.abs(data.currentWeight - data.startWeight);
  const progressPercent =
    totalSpan > 0 ? Math.min(100, Math.round((traveled / totalSpan) * 100)) : 0;

  const handleSave = () => {
    const nextWeight = parseFloat(weightInput);
    const nextGoal = parseFloat(goalInput);
    if (!Number.isNaN(nextWeight)) {
      updateWeight(nextWeight);
      track("weight_updated", { weight: nextWeight });
    }
    if (!Number.isNaN(nextGoal)) {
      setTargetWeight(nextGoal);
    }
    setModalOpen(false);
  };

  return (
    <>
      <section className="iron-card-raised p-4 space-y-3">
        <h3 className="iron-heading text-lg">{t("playerWeight.title")}</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-iron-muted">
              {t("playerWeight.current")}
            </p>
            <p className="text-2xl font-black text-iron-text mt-1">
              {data.currentWeight.toFixed(1)}
              <span className="text-sm font-semibold text-iron-muted ml-1">
                {t("playerWeight.kg")}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-iron-muted">
              {t("playerWeight.goal")}
            </p>
            <p className="text-2xl font-black text-iron-text mt-1">
              {data.targetWeight.toFixed(1)}
              <span className="text-sm font-semibold text-iron-muted ml-1">
                {t("playerWeight.kg")}
              </span>
            </p>
          </div>
        </div>

        <p className="text-sm text-iron-muted">
          {t("playerWeight.toGoal", { amount: diffToGoal.toFixed(1) })}
        </p>

        <div>
          <div className="flex justify-between text-xs text-iron-muted mb-1.5">
            <span>{t("playerWeight.progress")}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 iron-progress-track overflow-hidden rounded-sm">
            <AnimatedProgressFill percent={progressPercent} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="iron-interactive w-full iron-btn-secondary py-3 text-sm font-semibold rounded-sm"
        >
          {t("playerWeight.update")}
        </button>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="iron-modal iron-card-panel p-5 w-full max-w-sm space-y-3">
            <h3 className="iron-heading text-lg">{t("playerWeight.modalTitle")}</h3>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-wide text-iron-muted">
                {t("playerWeight.current")}
              </span>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs uppercase tracking-wide text-iron-muted">
                {t("playerWeight.goal")}
              </span>
              <input
                type="number"
                step="0.1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full border border-iron-border p-3 bg-iron-panel text-iron-text min-h-[48px] rounded-sm"
              />
            </label>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
              >
                {t("playerWeight.save")}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm"
              >
                {t("playerWeight.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
