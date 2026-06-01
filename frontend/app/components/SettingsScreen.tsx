"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onReset: () => void;
};

export default function SettingsScreen({ onClose, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setConfirming(false);
  };

  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center flex-1">
          <p className="uppercase tracking-[0.2em] text-sm font-bold">Options</p>
          <h2 className="text-4xl font-black uppercase mt-2">Settings</h2>
          <p className="mt-2 uppercase text-sm">App preferences and data</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="border-4 border-black px-4 py-2 bg-black text-[#efe3c2] uppercase text-xs font-black shrink-0 transition-transform active:scale-95"
        >
          Back
        </button>
      </div>

      <div className="mt-8 border-4 border-black bg-[#e8d8b0] p-5">
        <p className="uppercase tracking-[0.2em] text-sm font-bold text-[#b22222]">
          Danger Zone
        </p>

        <h3 className="text-2xl font-black uppercase mt-3">Reset Progress</h3>

        <p className="mt-3 uppercase text-sm leading-relaxed">
          Clears your profile, XP, level, week, stats, and all saved progress.
          This cannot be undone.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full mt-5 bg-black text-[#efe3c2] border-4 border-[#b22222] py-3 uppercase font-black transition-transform active:scale-[0.98]"
          >
            Reset Progress
          </button>
        ) : (
          <div className="mt-5 border-4 border-black bg-[#f5ead0] p-4">
            <p className="uppercase text-sm font-bold text-center">
              Are you sure? All progress will be lost.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="border-4 border-black py-3 uppercase font-black bg-[#e8d8b0] transition-transform active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="border-4 border-black py-3 uppercase font-black bg-[#b22222] text-[#efe3c2] transition-transform active:scale-[0.98]"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
