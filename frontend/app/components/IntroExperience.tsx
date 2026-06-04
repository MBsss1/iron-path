"use client";

import LogoIntroSequence from "./intro/LogoIntroSequence";
import { markIntroSeen } from "../utils/introStorage";

type Props = {
  onComplete: () => void;
};

/** First-run intro: inline SVG logo assembly → taglines → start CTA. */
export default function IntroExperience({ onComplete }: Props) {
  const handleBegin = () => {
    markIntroSeen();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[101] iron-page flex flex-col items-center justify-center px-6 py-10 bg-[var(--iron-bg)]">
      <LogoIntroSequence onBegin={handleBegin} />
    </div>
  );
}
