"use client";

import React, { useEffect, useState } from "react";
import { useStrengthTracker } from "../hooks/useStrengthTracker";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";

function ProgressBar({ percent, positive }: { percent: number; positive: boolean }) {
  const safe = Math.max(0, Math.min(100, Math.round(Math.abs(percent))));
  return (
    <div className="w-full h-3 iron-progress-track overflow-hidden">
      <div
        className={`${positive ? "iron-progress-fill" : "bg-red-600"} h-full transition-all`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

function diffText(cur?: number, prev?: number, unit = "") {
  if (prev === undefined || prev === null) return "";
  const diff = (cur ?? 0) - (prev ?? 0);
  const sign = diff > 0 ? "+" : diff < 0 ? "" : "";
  const n = Math.abs(diff);
  const formatted = Number.isInteger(n) ? String(n) : n.toFixed(1);
  return `${sign}${formatted}${unit ? ` ${unit}` : ""}`;
}

export default function StrengthTrackerScreen({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { data, updateMetric, reset } = useStrengthTracker();

  const [pushInput, setPushInput] = useState(String(data.pushUps ?? 0));
  const [pullInput, setPullInput] = useState(String(data.pullUps ?? 0));
  const [dipsInput, setDipsInput] = useState(String((data as { dips?: number }).dips ?? 0));
  const [runInput, setRunInput] = useState(String(data.runDistance ?? 0));
  const [weightInput, setWeightInput] = useState(String(data.weight ?? 0));

  useEffect(() => {
    setPushInput(String(data.pushUps ?? 0));
    setPullInput(String(data.pullUps ?? 0));
    setDipsInput(String((data as { dips?: number }).dips ?? 0));
    setRunInput(String(data.runDistance ?? 0));
    setWeightInput(String(data.weight ?? 0));
  }, [data]);

  const save = (key: string, raw: string) => {
    const n = parseFloat(raw || "0");
    if (Number.isNaN(n)) return;
    switch (key) {
      case "push":
        updateMetric("pushUps", Math.round(n));
        break;
      case "pull":
        updateMetric("pullUps", Math.round(n));
        break;
      case "dips":
        updateMetric("dips", Math.round(n));
        break;
      case "run":
        updateMetric("runDistance", n);
        break;
      case "weight":
        updateMetric("weight", n);
        break;
    }
  };

  const deltaPercent = (cur?: number, prev?: number) => {
    if (!prev || prev === 0) return cur ? 100 : 0;
    return ((cur! - prev) / Math.abs(prev)) * 100;
  };

  const inputClass =
    "w-full p-2 border border-iron-border bg-iron-panel text-iron-text";

  const metricCardClass = "border border-iron-border p-4 iron-card-panel";

  const formatPrevious = (value?: number) =>
    value === undefined || value === null
      ? t("strengthScreen.previousEmpty")
      : t("strengthScreen.previous", { value });

  const renderMetric = (
    label: string,
    current: number | undefined,
    previous: number | undefined,
    unit: string,
    inputValue: string,
    onInput: (value: string) => void,
    saveKey: string,
    positiveWhen: boolean
  ) => (
    <div className={metricCardClass}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase text-iron-gold">{label}</p>
          <p className="text-2xl font-black text-iron-cream">
            {current}{" "}
            <span className="text-sm text-iron-muted">
              {diffText(current, previous, unit)}
            </span>
          </p>
          <p className="text-xs text-iron-muted">{formatPrevious(previous)}</p>
        </div>

        <div className="w-40">
          <input
            className={inputClass}
            value={inputValue}
            onChange={(e) => onInput(e.target.value)}
            type="number"
            min={0}
            step={saveKey === "run" || saveKey === "weight" ? "0.1" : "1"}
          />
          <div className="mt-2">
            <button
              type="button"
              className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
              onClick={() => save(saveKey, inputValue)}
            >
              {t("strengthScreen.save")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-iron-muted">{t("common.progress")}</p>
        <ProgressBar
          percent={deltaPercent(current, previous)}
          positive={positiveWhen}
        />
      </div>
    </div>
  );

  return (
    <ScreenShell
      title={t("strengthScreen.title")}
      subtitle={t("strengthScreen.subtitle")}
      onBack={onBack}
    >
      {renderMetric(
        t("strengthScreen.pushUps"),
        data.pushUps,
        data.prevPushUps,
        t("strengthScreen.reps"),
        pushInput,
        setPushInput,
        "push",
        (data.prevPushUps ?? 0) <= data.pushUps
      )}

      {renderMetric(
        t("strengthScreen.pullUps"),
        data.pullUps,
        data.prevPullUps,
        t("strengthScreen.reps"),
        pullInput,
        setPullInput,
        "pull",
        (data.prevPullUps ?? 0) <= data.pullUps
      )}

      {renderMetric(
        t("strengthScreen.dips"),
        (data as { dips?: number }).dips,
        (data as { prevDips?: number }).prevDips,
        t("strengthScreen.reps"),
        dipsInput,
        setDipsInput,
        "dips",
        ((data as { prevDips?: number }).prevDips ?? 0) <=
          ((data as { dips?: number }).dips ?? 0)
      )}

      {renderMetric(
        t("strengthScreen.runDistance"),
        data.runDistance,
        data.prevRunDistance,
        "km",
        runInput,
        setRunInput,
        "run",
        (data.prevRunDistance ?? 0) <= data.runDistance
      )}

      {renderMetric(
        t("strengthScreen.bodyWeight"),
        data.weight,
        data.prevWeight,
        "kg",
        weightInput,
        setWeightInput,
        "weight",
        (data.prevWeight ?? 0) >= data.weight ? false : true
      )}

      <button
        type="button"
        className="w-full bg-iron-charcoal text-iron-cream border border-iron-border py-2 uppercase font-bold"
        onClick={() => reset()}
      >
        {t("strengthScreen.reset")}
      </button>
    </ScreenShell>
  );
}
