"use client";

import { useEffect } from "react";

type Props = {
  amount: number;
  onDone: () => void;
};

export default function XpFloatAnimation({ amount, onDone }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1350);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-xp-float"
      aria-live="polite"
    >
      <div className="iron-shell-card px-6 py-3 border border-iron-border-strong">
        <p className="text-xl font-semibold iron-text-accent">+{amount} XP</p>
      </div>
    </div>
  );
}
