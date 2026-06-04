"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  formatted: string;
  className?: string;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function AnimatedDigit({
  char,
  prevChar,
  animate,
}: {
  char: string;
  prevChar: string | undefined;
  animate: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "rolling">("idle");
  const [outgoing, setOutgoing] = useState(prevChar ?? char);

  useEffect(() => {
    if (!animate || char === prevChar) return;
    setOutgoing(prevChar ?? char);
    setPhase("rolling");
    const id = window.setTimeout(() => setPhase("idle"), 380);
    return () => window.clearTimeout(id);
  }, [char, prevChar, animate]);

  if (!animate || phase === "idle") {
    return <span className="timer-digit-current">{char}</span>;
  }

  return (
    <span className="timer-digit-wheel-inner">
      <span className="timer-digit-outgoing" aria-hidden="true">
        {outgoing}
      </span>
      <span className="timer-digit-incoming">{char}</span>
    </span>
  );
}

export default function AnimatedTimerDigits({ formatted, className = "" }: Props) {
  const prevRef = useRef(formatted);
  const prevFormatted = prevRef.current;
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    prevRef.current = formatted;
  }, [formatted]);

  return (
    <span
      className={`inline-flex items-center justify-center tabular-nums ${className}`}
      aria-hidden="true"
    >
      {formatted.split("").map((char, index) => {
        if (char === ":") {
          return (
            <span key={`sep-${index}`} className="timer-digit-separator mx-0.5">
              :
            </span>
          );
        }
        return (
          <span key={`d-${index}`} className="timer-digit-wheel">
            <AnimatedDigit
              char={char}
              prevChar={prevFormatted[index]}
              animate={!reduced}
            />
          </span>
        );
      })}
    </span>
  );
}
