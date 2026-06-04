"use client";

import { ReactNode } from "react";
import { premiumScreenTransition, cardReveal } from "../animations/classes";
import { usePrefersReducedMotion } from "../animations/usePrefersReducedMotion";

type Props = {
  screen: string;
  children: ReactNode;
};

export default function ScreenTransition({ screen, children }: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      key={screen}
      className={`w-full ${reduced ? "" : `${premiumScreenTransition} ${cardReveal}`}`}
    >
      {children}
    </div>
  );
}
