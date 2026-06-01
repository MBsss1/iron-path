"use client";

import { useEffect } from "react";

type Props = {
  amount: number;
  onDone: () => void;
};

export default function XpFloatAnimation({ amount, onDone }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-xp-float"
      aria-live="polite"
    >
      <div className="border-4 border-black bg-[#f5ead0] px-6 py-3 shadow-2xl">
        <p className="text-2xl font-black uppercase text-[#b22222] tracking-wider">
          +{amount} XP
        </p>
      </div>
    </div>
  );
}
