"use client";

import React, { useEffect, useState } from "react";
import { useStrengthTracker } from "../hooks/useStrengthTracker";

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
  return `${sign}${formatted}${unit ? " " + unit : ""}`;
}

export default function StrengthTrackerScreen({ onBack }: { onBack: () => void }) {
  const { data, updateMetric, reset } = useStrengthTracker();

  const [pushInput, setPushInput] = useState(String(data.pushUps ?? 0));
  const [pullInput, setPullInput] = useState(String(data.pullUps ?? 0));
  const [dipsInput, setDipsInput] = useState(String((data as any).dips ?? 0));
  const [runInput, setRunInput] = useState(String(data.runDistance ?? 0));
  const [weightInput, setWeightInput] = useState(String(data.weight ?? 0));

  useEffect(() => {
    setPushInput(String(data.pushUps ?? 0));
    setPullInput(String(data.pullUps ?? 0));
    setDipsInput(String((data as any).dips ?? 0));
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

  return (
    <div className="w-full max-w-md iron-shell-card p-5 sm:p-6 mb-24">
      <div className="text-center mt-2">
        <h1 className="text-3xl font-black tracking-wide text-iron-text">Strength Tracker</h1>
        <p className="text-sm mt-2 uppercase tracking-[0.2em] text-iron-muted">Log your lifts and runs — track progress</p>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-iron-panel text-iron-cream border border-iron-border-strong py-2 px-4 uppercase font-bold"
          onClick={onBack}
        >
          Back
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {/* Push-ups */}
        <div className={metricCardClass}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-iron-gold">Push-ups (max)</p>
              <p className="text-2xl font-black text-iron-cream">{data.pushUps} <span className="text-sm text-iron-muted">{diffText(data.pushUps, data.prevPushUps, 'reps')}</span></p>
              <p className="text-xs text-iron-muted">Previous: {data.prevPushUps ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className={inputClass}
                value={pushInput}
                onChange={(e) => setPushInput(e.target.value)}
                type="number"
                min={0}
              />
              <div className="mt-2">
                <button
                  className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
                  onClick={() => save("push", pushInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-iron-muted">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.pushUps, data.prevPushUps)}
              positive={(data.prevPushUps ?? 0) <= data.pushUps}
            />
          </div>
        </div>

        {/* Pull-ups */}
        <div className={metricCardClass}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-iron-gold">Pull-ups (max)</p>
              <p className="text-2xl font-black text-iron-cream">{data.pullUps} <span className="text-sm text-iron-muted">{diffText(data.pullUps, data.prevPullUps, 'reps')}</span></p>
              <p className="text-xs text-iron-muted">Previous: {data.prevPullUps ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className={inputClass}
                value={pullInput}
                onChange={(e) => setPullInput(e.target.value)}
                type="number"
                min={0}
              />
              <div className="mt-2">
                <button
                  className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
                  onClick={() => save("pull", pullInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-iron-muted">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.pullUps, data.prevPullUps)}
              positive={(data.prevPullUps ?? 0) <= data.pullUps}
            />
          </div>
        </div>

        {/* Dips */}
        <div className={metricCardClass}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-iron-gold">Dips (max)</p>
              <p className="text-2xl font-black text-iron-cream">{(data as any).dips} <span className="text-sm text-iron-muted">{diffText((data as any).dips, (data as any).prevDips, 'reps')}</span></p>
              <p className="text-xs text-iron-muted">Previous: {(data as any).prevDips ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className={inputClass}
                value={dipsInput}
                onChange={(e) => setDipsInput(e.target.value)}
                type="number"
                min={0}
              />
              <div className="mt-2">
                <button
                  className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
                  onClick={() => save("dips", dipsInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-iron-muted">Progress</p>
            <ProgressBar
              percent={deltaPercent((data as any).dips, (data as any).prevDips)}
              positive={((data as any).prevDips ?? 0) <= (data as any).dips}
            />
          </div>
        </div>

        {/* Run distance */}
        <div className={metricCardClass}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-iron-gold">Run Distance (km)</p>
              <p className="text-2xl font-black text-iron-cream">{data.runDistance} <span className="text-sm text-iron-muted">{diffText(data.runDistance, data.prevRunDistance, 'km')}</span></p>
              <p className="text-xs text-iron-muted">Previous: {data.prevRunDistance ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className={inputClass}
                value={runInput}
                onChange={(e) => setRunInput(e.target.value)}
                type="number"
                step="0.1"
                min={0}
              />
              <div className="mt-2">
                <button
                  className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
                  onClick={() => save("run", runInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-iron-muted">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.runDistance, data.prevRunDistance)}
              positive={(data.prevRunDistance ?? 0) <= data.runDistance}
            />
          </div>
        </div>

        {/* Body weight */}
        <div className={metricCardClass}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-iron-gold">Body Weight (kg)</p>
              <p className="text-2xl font-black text-iron-cream">{data.weight} <span className="text-sm text-iron-muted">{diffText(data.weight, data.prevWeight, 'kg')}</span></p>
              <p className="text-xs text-iron-muted">Previous: {data.prevWeight ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className={inputClass}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                type="number"
                step="0.1"
                min={0}
              />
              <div className="mt-2">
                <button
                  className="w-full bg-iron-panel text-iron-cream border border-iron-border py-2 uppercase font-bold"
                  onClick={() => save("weight", weightInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-iron-muted">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.weight, data.prevWeight)}
              positive={(data.prevWeight ?? 0) >= data.weight ? false : true}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-iron-charcoal text-iron-cream border border-iron-border py-2 uppercase font-bold"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
