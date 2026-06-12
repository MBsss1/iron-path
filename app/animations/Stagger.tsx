"use client";

import type { ReactNode } from "react";
import { staggerChildren } from "./classes";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Staggered card reveal for lists and screen sections. */
export default function Stagger({ children, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const cls = reduced ? className : `${staggerChildren} ${className}`.trim();
  return <div className={cls}>{children}</div>;
}
