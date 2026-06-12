"use client";

import { useEffect, useState } from "react";
import { useStrengthTracker } from "../../hooks/useStrengthTracker";
import { useFitnessAssessment } from "../../hooks/useFitnessAssessment";
import { useTranslation } from "../../i18n/useTranslation";
import IronCard from "../IronCard";

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

export default function ProgressStrengthSection() {
  const { t } = useTranslation();
  const { isComplete, input: assessmentInput } = useFitnessAssessment();
  const { data, updateMetric, reset } = useStrengthTracker();

  const [pushInput, setPushInput] = useState(String(data.pushUps ?? 0));
  const [pullInput, setPullInput] = useState(String(data.pullUps ?? 0));
  const [squatInput, setSquatInput] = useState(String(data.squatReps ?? 0));
  const [plankInput, setPlankInput] = useState(String(data.plankSeconds ?? 0));

  useEffect(() => {
    setPushInput(String(data.pushUps ?? 0));
    setPullInput(String(data.pullUps ?? 0));
    setSquatInput(String(data.squatReps ?? 0));
    setPlankInput(String(data.plankSeconds ?? 0));
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
      case "squat":
        updateMetric("squatReps", Math.round(n));
        break;
      case "plank":
        updateMetric("plankSeconds", Math.round(n));
        break;
    }
  };

  const deltaPercent = (cur?: number, prev?: number) => {
    if (!prev || prev === 0) return cur ? 100 : 0;
    return ((cur! - prev) / Math.abs(prev)) * 100;
  };

  const inputClass =
    "w-full p-2 border border-iron-border bg-iron-panel text-iron-text text-sm";

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
    positiveWhen: boolean,
    step = "1"
  ) => (
    <div className={metricCardClass}>
      <div className="flex justify-between items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase text-iron-gold">{label}</p>
          <p className="text-2xl font-black text-iron-cream">
            {current ?? 0}{" "}
            <span className="text-sm text-iron-muted">
              {diffText(current, previous, unit)}
            </span>
          </p>
          <p className="text-xs text-iron-muted">{formatPrevious(previous)}</p>
        </div>

        <div className="w-28 shrink-0">
          <input
            className={inputClass}
            value={inputValue}
            onChange={(e) => onInput(e.target.value)}
            type="number"
            min={0}
            step={step}
          />
          <button
            type="button"
            className="w-full mt-2 bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase text-xs font-bold"
            onClick={() => save(saveKey, inputValue)}
          >
            {t("strengthScreen.save")}
          </button>
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
    <div className="space-y-4">
      {isComplete && assessmentInput && (
        <IronCard variant="paper">
          <p className="text-xs uppercase font-bold text-iron-gold">
            {t("progressScreen.assessmentBaseline")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="text-iron-muted">{t("progressScreen.metricPullUps")}</span>
              <span className="font-bold text-iron-cream">{assessmentInput.maxPullUps}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-iron-muted">{t("progressScreen.metricPushUps")}</span>
              <span className="font-bold text-iron-cream">{assessmentInput.maxPushUps}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-iron-muted">{t("progressScreen.metricSquats")}</span>
              <span className="font-bold text-iron-cream">
                {assessmentInput.squatReps2Min} {t("progressScreen.squatsUnit")}
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-iron-muted">{t("progressScreen.metricPlank")}</span>
              <span className="font-bold text-iron-cream">
                {assessmentInput.plankSeconds} {t("progressScreen.plankUnit")}
              </span>
            </li>
          </ul>
        </IronCard>
      )}

      <p className="text-xs uppercase text-iron-muted">{t("progressScreen.personalRecords")}</p>

      {renderMetric(
        t("progressScreen.metricPullUps"),
        data.pullUps,
        data.prevPullUps,
        t("strengthScreen.reps"),
        pullInput,
        setPullInput,
        "pull",
        (data.prevPullUps ?? 0) <= (data.pullUps ?? 0)
      )}

      {renderMetric(
        t("progressScreen.metricPushUps"),
        data.pushUps,
        data.prevPushUps,
        t("strengthScreen.reps"),
        pushInput,
        setPushInput,
        "push",
        (data.prevPushUps ?? 0) <= (data.pushUps ?? 0)
      )}

      {renderMetric(
        t("progressScreen.metricSquats"),
        data.squatReps,
        data.prevSquatReps,
        t("strengthScreen.reps"),
        squatInput,
        setSquatInput,
        "squat",
        (data.prevSquatReps ?? 0) <= (data.squatReps ?? 0)
      )}

      {renderMetric(
        t("progressScreen.metricPlank"),
        data.plankSeconds,
        data.prevPlankSeconds,
        t("progressScreen.plankUnit"),
        plankInput,
        setPlankInput,
        "plank",
        (data.prevPlankSeconds ?? 0) <= (data.plankSeconds ?? 0)
      )}

      <button
        type="button"
        className="w-full bg-iron-charcoal text-iron-muted border border-iron-border py-2 uppercase text-xs font-bold hover:text-iron-text"
        onClick={() => reset()}
      >
        {t("strengthScreen.reset")}
      </button>
    </div>
  );
}
