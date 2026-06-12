"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  percent: number;
  className?: string;
  variant?: "default" | "danger";
  durationMs?: number;
};

/** Progress fill using transform (GPU-friendly). */
export default function AnimatedProgressFill({
  percent,
  className = "",
  variant = "default",
  durationMs = 700,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));
  const [scale, setScale] = useState(reduced ? clamped / 100 : 0);

  useEffect(() => {
    if (reduced) {
      setScale(clamped / 100);
      return;
    }
    const id = requestAnimationFrame(() => setScale(clamped / 100));
    return () => cancelAnimationFrame(id);
  }, [clamped, reduced]);

  const fillClass =
    variant === "danger" ? "iron-progress-fill-danger" : "iron-progress-fill";

  return (
    <div
      className={`h-full w-full ${fillClass} iron-progress-fill-animated ${className}`.trim()}
      style={{
        transform: `scaleX(${scale})`,
        transitionDuration: reduced ? "0ms" : `${durationMs}ms`,
      }}
      role="presentation"
      aria-hidden="true"
    />
  );
}
