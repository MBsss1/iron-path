"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import XPGainBurst from "./XPGainBurst";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

type Props = {
  xp: number;
  maxXp: number;
  className?: string;
};

/** XP bar that animates from the previous value and bursts on gain. */
export default function AnimatedXpBar({ xp, maxXp, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const prevXpRef = useRef(xp);
  const [burst, setBurst] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(
    maxXp > 0 ? Math.min(100, Math.round((xp / maxXp) * 100)) : 0
  );

  const targetPercent =
    maxXp > 0 ? Math.min(100, Math.round((xp / maxXp) * 100)) : 0;

  useEffect(() => {
    if (xp > prevXpRef.current) {
      if (!reduced) setBurst(true);
      const burstTimer = window.setTimeout(() => setBurst(false), 900);
      prevXpRef.current = xp;
      setDisplayPercent(targetPercent);
      return () => window.clearTimeout(burstTimer);
    }
    prevXpRef.current = xp;
    setDisplayPercent(targetPercent);
  }, [xp, targetPercent, reduced]);

  return (
    <div className={`relative ${className}`.trim()}>
      <div className="w-full h-1 iron-hud-progress-track overflow-hidden rounded-sm relative">
        <AnimatedProgressFill percent={displayPercent} durationMs={750} />
        <XPGainBurst active={burst} />
      </div>
    </div>
  );
}
