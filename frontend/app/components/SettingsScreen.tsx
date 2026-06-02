"use client";

import { useState } from "react";

type Props = {
  onBack: () => void;
  onReset: () => void;
};

export default function SettingsScreen({ onBack, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setConfirming(false);
  };

  return (
    <div className="mt-10 iron-shell-card p-6 mb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="text-center flex-1">
          <p className="iron-label">Options</p>
          <h2 className="iron-heading text-3xl mt-2">Settings</h2>
          <p className="mt-2 text-sm text-iron-muted">App preferences and data</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="border border-iron-border-strong px-4 py-2 bg-iron-panel text-iron-cream uppercase text-xs font-black shrink-0 transition-transform active:scale-95"
        >
          Back
        </button>
      </div>

      <div className="mt-8 border border-iron-border-strong iron-card-raised p-5">
        <p className="iron-label text-iron-danger">Danger zone</p>

        <h3 className="iron-heading text-xl mt-3">Reset progress</h3>

        <p className="mt-3 text-sm leading-relaxed text-iron-muted">
          Clears your profile, XP, level, week, stats, and all saved progress.
          This cannot be undone.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full mt-5 iron-interactive iron-btn-secondary py-3 text-sm font-semibold rounded-sm border-iron-danger"
          >
            Reset Progress
          </button>
        ) : (
          <div className="mt-5 border border-iron-border iron-card-panel p-4">
            <p className="uppercase text-sm font-bold text-center text-iron-cream">
              Are you sure? All progress will be lost.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="border border-iron-border py-3 uppercase font-black iron-card-raised text-iron-text transition-transform active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="iron-interactive iron-btn-danger py-3 text-sm font-semibold rounded-sm"
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
