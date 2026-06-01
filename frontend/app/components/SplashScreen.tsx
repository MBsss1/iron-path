"use client";

import { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"fade-in" | "fade-out">("fade-in");

  useEffect(() => {
    const fadeOutTimer = window.setTimeout(() => setPhase("fade-out"), 1200);
    const completeTimer = window.setTimeout(() => onComplete(), 1600);

    return () => {
      window.clearTimeout(fadeOutTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#d8c7a1] to-[#efe3c2] ${
        phase === "fade-in" ? "animate-splash-fade-in" : "animate-splash-fade-out"
      }`}
      aria-hidden="true"
    >
      <div className="text-center border-4 border-black bg-[#f5ead0] py-10 px-12 shadow-2xl animate-splash-logo">
        <h1 className="text-5xl font-black tracking-wide text-black">IRON PATH</h1>
        <p className="text-sm mt-3 uppercase tracking-[0.3em] text-black/80">
          Est. 1950
        </p>
        <div className="mt-6 h-1 w-24 mx-auto bg-[#b22222]" />
        <p className="mt-4 text-xs uppercase tracking-widest font-bold text-black/60">
          Loading
        </p>
      </div>
    </div>
  );
}
