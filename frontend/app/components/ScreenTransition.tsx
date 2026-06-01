"use client";

import { ReactNode } from "react";

type Props = {
  screen: string;
  children: ReactNode;
};

export default function ScreenTransition({ screen, children }: Props) {
  return (
    <div key={screen} className="animate-screen-enter w-full">
      {children}
    </div>
  );
}
