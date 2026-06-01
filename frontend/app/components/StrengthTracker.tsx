"use client";

import React, { useEffect, useState } from "react";
import { useStrengthTracker } from "../hooks/useStrengthTracker";

function ProgressBar({ percent, positive }: { percent: number; positive: boolean }) {
  const safe = Math.max(0, Math.min(100, Math.round(Math.abs(percent))));
  return (
    <div className="w-full h-3 bg-[#e6e6e6] rounded overflow-hidden border border-black">
      <div
        className={`h-full ${positive ? "bg-green-600" : "bg-red-600"} transition-all"`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

export default function StrengthTracker() {
  const { data, updateMetric, reset } = useStrengthTracker();

  const [pushInput, setPushInput] = useState(String(data.pushUps ?? 0));
  const [pullInput, setPullInput] = useState(String(data.pullUps ?? 0));
  const [runInput, setRunInput] = useState(String(data.runDistance ?? 0));
  const [weightInput, setWeightInput] = useState(String(data.weight ?? 0));

  useEffect(() => {
    setPushInput(String(data.pushUps ?? 0));
    setPullInput(String(data.pullUps ?? 0));
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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mt-6">
        <h1 className="text-3xl font-black tracking-wide">Strength Tracker</h1>
        <p className="text-sm mt-2 uppercase tracking-[0.2em]">Log and track simple strength metrics</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Push-ups */}
        <div className="border-4 border-black p-4 bg-[#f5ead0]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase">Push-ups (max)</p>
              <p className="text-2xl font-black">{data.pushUps}</p>
              <p className="text-xs">Previous: {data.prevPushUps ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className="w-full p-2 border-2 border-black bg-white"
                value={pushInput}
                onChange={(e) => setPushInput(e.target.value)}
                type="number"
                min={0}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
                  onClick={() => save("push", pushInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.pushUps, data.prevPushUps)}
              positive={(data.prevPushUps ?? 0) <= data.pushUps}
            />
          </div>
        </div>

        {/* Pull-ups */}
        <div className="border-4 border-black p-4 bg-[#f5ead0]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase">Pull-ups (max)</p>
              <p className="text-2xl font-black">{data.pullUps}</p>
              <p className="text-xs">Previous: {data.prevPullUps ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className="w-full p-2 border-2 border-black bg-white"
                value={pullInput}
                onChange={(e) => setPullInput(e.target.value)}
                type="number"
                min={0}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
                  onClick={() => save("pull", pullInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.pullUps, data.prevPullUps)}
              positive={(data.prevPullUps ?? 0) <= data.pullUps}
            />
          </div>
        </div>

        {/* Run distance */}
        <div className="border-4 border-black p-4 bg-[#f5ead0]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase">Run Distance (km)</p>
              <p className="text-2xl font-black">{data.runDistance}</p>
              <p className="text-xs">Previous: {data.prevRunDistance ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className="w-full p-2 border-2 border-black bg-white"
                value={runInput}
                onChange={(e) => setRunInput(e.target.value)}
                type="number"
                step="0.1"
                min={0}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
                  onClick={() => save("run", runInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.runDistance, data.prevRunDistance)}
              positive={(data.prevRunDistance ?? 0) <= data.runDistance}
            />
          </div>
        </div>

        {/* Body weight */}
        <div className="border-4 border-black p-4 bg-[#f5ead0]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase">Body Weight (kg)</p>
              <p className="text-2xl font-black">{data.weight}</p>
              <p className="text-xs">Previous: {data.prevWeight ?? "—"}</p>
            </div>

            <div className="w-40">
              <input
                className="w-full p-2 border-2 border-black bg-white"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                type="number"
                step="0.1"
                min={0}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
                  onClick={() => save("weight", weightInput)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs">Progress</p>
            <ProgressBar
              percent={deltaPercent(data.weight, data.prevWeight)}
              positive={(data.prevWeight ?? 0) >= data.weight ? false : true}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
