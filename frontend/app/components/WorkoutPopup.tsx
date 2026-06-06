"use client";

import CompletionCelebration from "./rpg/CompletionCelebration";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  isOpen: boolean;
  xpReward: number;
  xp: number;
  maxXp: number;
  onClose: () => void;
};

export default function WorkoutPopup({
  isOpen,
  xpReward,
  xp,
  maxXp,
  onClose,
}: Props) {
  const { t } = useTranslation();

  return (
    <CompletionCelebration
      isOpen={isOpen}
      variant="workout"
      title={t("popup.workout.title")}
      subtitle={t("popup.workout.body")}
      phrase={t("animations.workoutCompletePhrase")}
      xpAmount={xpReward}
      xpProgress={{
        current: xp,
        max: maxXp,
        label: t("animations.xpProgressLabel"),
      }}
      rewards={[]}
      closeLabel={t("popup.workout.continue")}
      onClose={onClose}
    />
  );
}
