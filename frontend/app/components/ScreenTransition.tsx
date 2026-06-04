"use client";

import { ReactNode } from "react";
import { screenTransition } from "../animations/classes";

type Props = {
  screen: string;
  children: ReactNode;
};

export default function ScreenTransition({ screen, children }: Props) {
  return (
    <div key={screen} className={`${screenTransition} w-full`}>
      {children}
    </div>
  );
}
