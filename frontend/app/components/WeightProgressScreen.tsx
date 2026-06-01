"use client";

import React, { useState } from "react";
import { useWeightProgress } from "../hooks/useWeightProgress";

export default function WeightProgressScreen() {
  const { data, updateWeight, setTargetWeight, reset } = useWeightProgress();
  const [weightInput, setWeightInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showTargetInput, setShowTargetInput] = useState(false);

  if (!data) {
    return (
      <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-xl">
        <p className="text-center uppercase font-bold">Loading weight data...</p>
      </div>
    );
  }

  const totalChange = data.currentWeight - data.startWeight;
  const lastUpdate = data.history.length > 0 ? data.history[data.history.length - 1].date : "—";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
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
  const progressPercent = ((data.currentWeight - data.startWeight) / Math.max(Math.abs(data.targetWeight - data.startWeight), 1)) * 100;

  return (
    <div className="mt-6 space-y-4">
      {/* Main stats */}
      <div className="border-4 border-black p-4 bg-black text-[#efe3c2]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest">Current Weight</p>
            <p className="text-4xl font-black">{data.currentWeight}</p>
            <p className="text-sm uppercase mt-1">kg</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest">Total Change</p>
            <p className={`text-2xl font-black ${totalChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)}
            </p>
            <p className="text-sm uppercase mt-1">kg</p>
          </div>
        </div>
      </div>

      {/* Start & Target */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border-2 border-black p-3 bg-[#e8d8b0]">
          <p className="text-xs uppercase font-bold">Start Weight</p>
          <p className="text-2xl font-black">{data.startWeight}</p>
          <p className="text-xs uppercase">kg</p>
        </div>

        <div className="border-2 border-black p-3 bg-[#efe3c2]">
          <p className="text-xs uppercase font-bold">Target</p>
          <p className="text-2xl font-black">{data.targetWeight}</p>
          <p className="text-xs uppercase">{diffToTarget > 0 ? "+" : ""}{diffToTarget.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-2 border-black p-3 bg-[#f5ead0]">
        <div className="flex justify-between mb-2">
          <span className="text-xs uppercase font-bold">Progress to Target</span>
          <span className="text-xs font-bold">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full h-4 bg-[#e6e6e6] border border-black overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#b22222] to-[#d4a574] transition-all"
            style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Update current weight */}
      {!showInput ? (
        <button
          className="w-full bg-[#b22222] text-[#efe3c2] border-4 border-black py-3 uppercase font-black tracking-widest hover:bg-[#8b1a1a]"
          onClick={() => {
            setWeightInput(String(data.currentWeight));
            setShowInput(true);
          }}
        >
          Update Current Weight
        </button>
      ) : (
        <div className="border-2 border-black p-3 bg-[#efe3c2]">
          <input
            className="w-full p-2 border-2 border-black bg-white"
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="Enter weight in kg"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
              onClick={handleSaveWeight}
            >
              Save
            </button>
            <button
              className="flex-1 bg-[#e6e6e6] text-black border-2 border-black py-2 uppercase font-bold"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Update target weight */}
      {!showTargetInput ? (
        <button
          className="w-full bg-[#333] text-[#efe3c2] border-4 border-black py-3 uppercase font-black tracking-widest hover:bg-black"
          onClick={() => {
            setTargetInput(String(data.targetWeight));
            setShowTargetInput(true);
          }}
        >
          Set Target Weight
        </button>
      ) : (
        <div className="border-2 border-black p-3 bg-[#efe3c2]">
          <input
            className="w-full p-2 border-2 border-black bg-white"
            type="number"
            step="0.1"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="Enter target weight in kg"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-black text-[#efe3c2] border-2 border-black py-2 uppercase font-bold"
              onClick={handleSaveTarget}
            >
              Save
            </button>
            <button
              className="flex-1 bg-[#e6e6e6] text-black border-2 border-black py-2 uppercase font-bold"
              onClick={() => setShowTargetInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Last update date */}
      <div className="border-2 border-black p-3 bg-[#f5ead0] text-center">
        <p className="text-xs uppercase font-bold">Last Updated</p>
        <p className="text-lg font-black uppercase">{formatDate(lastUpdate)}</p>
      </div>

      {/* Weight history */}
      {data.history.length > 0 && (
        <div className="border-4 border-black p-4 bg-[#efe3c2]">
          <p className="text-sm uppercase font-black mb-3">Weight History</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...data.history].reverse().map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-black pb-2">
                <span className="text-xs uppercase">{formatDate(entry.date)}</span>
                <span className="font-black">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        className="w-full bg-[#999] text-black border-4 border-black py-3 uppercase font-black tracking-widest hover:bg-[#888]"
        onClick={reset}
      >
        Reset to Profile Weight
      </button>
    </div>
  );
}
