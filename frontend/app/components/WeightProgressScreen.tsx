"use client";

import React, { useState } from "react";
import { useWeightProgress } from "../hooks/useWeightProgress";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  compact?: boolean;
};

export default function WeightProgressScreen({ compact = false }: Props) {
  const { t, locale } = useTranslation();
  const { data, updateWeight, setTargetWeight, reset } = useWeightProgress();
  const [weightInput, setWeightInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showTargetInput, setShowTargetInput] = useState(false);

  const w = (key: string) => t(`nutrition.weightScreen.${key}`);
  const kg = w("kg");

  if (!data) {
    return (
      <div className="mt-10 iron-shell-card p-6">
        <p className="text-center uppercase font-bold text-iron-muted">{w("loading")}</p>
      </div>
    );
  }

  const totalChange = data.currentWeight - data.startWeight;
  const lastUpdate = data.history.length > 0 ? data.history[data.history.length - 1].date : "—";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const dateLocale = locale === "ru" ? "ru-RU" : "en-US";
      return date.toLocaleDateString(dateLocale, {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleSaveWeight = () => {
    const val = parseFloat(weightInput);
    if (!Number.isNaN(val)) {
      updateWeight(val);
      setWeightInput("");
      setShowInput(false);
    }
  };

  const handleSaveTarget = () => {
    const val = parseFloat(targetInput);
    if (!Number.isNaN(val)) {
      setTargetWeight(val);
      setTargetInput("");
      setShowTargetInput(false);
    }
  };

  const diffToTarget = data.targetWeight - data.currentWeight;
  const progressPercent =
    ((data.currentWeight - data.startWeight) /
      Math.max(Math.abs(data.targetWeight - data.startWeight), 1)) *
    100;

  const inputClass =
    "w-full p-2 border border-iron-border bg-iron-panel text-iron-text";

  return (
    <div className={`${compact ? "mt-0" : "mt-6"} space-y-4`}>
      <div className="border border-iron-border-strong p-4 iron-card-panel">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-iron-gold">
              {w("currentWeight")}
            </p>
            <p className="text-4xl font-black text-iron-cream">{data.currentWeight}</p>
            <p className="text-sm uppercase mt-1 text-iron-muted">{kg}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-iron-gold">
              {w("totalChange")}
            </p>
            <p
              className={`text-2xl font-black ${totalChange >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {totalChange > 0 ? "+" : ""}
              {totalChange.toFixed(1)}
            </p>
            <p className="text-sm uppercase mt-1 text-iron-muted">{kg}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-iron-border p-3 iron-card-raised">
          <p className="text-xs uppercase font-bold text-iron-gold">{w("startWeight")}</p>
          <p className="text-2xl font-black text-iron-text">{data.startWeight}</p>
          <p className="text-xs uppercase text-iron-muted">{kg}</p>
        </div>

        <div className="border border-iron-border p-3 bg-iron-raised">
          <p className="text-xs uppercase font-bold text-iron-gold">{w("target")}</p>
          <p className="text-2xl font-black text-iron-text">{data.targetWeight}</p>
          <p className="text-xs uppercase text-iron-muted">
            {diffToTarget > 0 ? "+" : ""}
            {diffToTarget.toFixed(1)} {kg}
          </p>
        </div>
      </div>

      <div className="border border-iron-border p-3 iron-card-panel">
        <div className="flex justify-between mb-2">
          <span className="text-xs uppercase font-bold text-iron-gold">
            {w("progressToTarget")}
          </span>
          <span className="text-xs font-bold text-iron-cream">
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-4 iron-progress-track overflow-hidden">
          <div
            className="h-full iron-progress-fill transition-all"
            style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
          />
        </div>
      </div>

      {!showInput ? (
        <button
          className="w-full iron-interactive iron-btn-primary py-3 text-sm font-semibold rounded-sm"
          onClick={() => {
            setWeightInput(String(data.currentWeight));
            setShowInput(true);
          }}
        >
          {w("updateCurrentWeight")}
        </button>
      ) : (
        <div className="border border-iron-border p-3 iron-card-raised">
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder={w("enterCurrentWeight")}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
              onClick={handleSaveWeight}
            >
              {w("save")}
            </button>
            <button
              className="flex-1 bg-iron-charcoal text-iron-text border border-iron-border py-2 uppercase font-bold"
              onClick={() => setShowInput(false)}
            >
              {w("cancel")}
            </button>
          </div>
        </div>
      )}

      {!showTargetInput ? (
        <button
          className="w-full bg-iron-panel text-iron-cream border border-iron-border-strong py-3 uppercase font-black tracking-widest hover:border-iron-gold-dim"
          onClick={() => {
            setTargetInput(String(data.targetWeight));
            setShowTargetInput(true);
          }}
        >
          {w("setTargetWeight")}
        </button>
      ) : (
        <div className="border border-iron-border p-3 iron-card-raised">
          <input
            className={inputClass}
            type="number"
            step="0.1"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder={w("enterTargetWeight")}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
              onClick={handleSaveTarget}
            >
              {w("save")}
            </button>
            <button
              className="flex-1 bg-iron-charcoal text-iron-text border border-iron-border py-2 uppercase font-bold"
              onClick={() => setShowTargetInput(false)}
            >
              {w("cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="border border-iron-border p-3 iron-card-panel text-center">
        <p className="text-xs uppercase font-bold text-iron-gold">{w("lastUpdated")}</p>
        <p className="text-lg font-black uppercase text-iron-cream">
          {data.history.length > 0 ? formatDate(lastUpdate) : "—"}
        </p>
      </div>

      <div className="border border-iron-border-strong p-4 iron-card-raised">
        <p className="text-sm uppercase font-black mb-3 text-iron-text">{w("weightHistory")}</p>
        {data.history.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...data.history].reverse().map((entry, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-iron-border pb-2"
              >
                <span className="text-xs uppercase text-iron-muted">
                  {formatDate(entry.date)}
                </span>
                <span className="font-black text-iron-cream">
                  {entry.weight} {kg}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs uppercase text-iron-muted text-center py-2">{w("noHistory")}</p>
        )}
      </div>

      <button
        className="w-full bg-iron-charcoal text-iron-muted border border-iron-border py-3 uppercase font-black tracking-widest hover:text-iron-text"
        onClick={reset}
      >
        {w("backToProfileWeight")}
      </button>
    </div>
  );
}
