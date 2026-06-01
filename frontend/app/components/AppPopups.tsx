"use client";

import WeekCompletePopup from "./WeekCompletePopup";
import WorkoutPopup from "./WorkoutPopup";
import LevelUpPopup from "./LevelUpPopup";
import AchievementPopup from "./AchievementPopup";
import BossTrialPopup from "./BossTrialPopup";
import SeasonCompletePopup from "./SeasonCompletePopup";
import { getBossTrialByWeek } from "../data/bossTrials";
import type { AchievementDefinition } from "../data/achievements";
import type { BossTrialId } from "../data/bossTrials";
import type { SeasonRecord } from "../hooks/useSeasons";

type InlineProps = {
  placement: "inline";
  pendingSeasonComplete: boolean;
  completedSeasons: SeasonRecord[];
  onClaimSeason: () => void;
  onCloseSeason: () => void;
};

type FloatingProps = {
  placement: "floating";
  showWeekPopup: boolean;
  week: number;
  phase: string;
  onCloseWeekPopup: () => void;
  showPopup: boolean;
  lastXpReward: number;
  onCloseWorkoutPopup: () => void;
  leveledUp: boolean;
  level: number;
  rank: string;
  onCloseLevelUp: () => void;
  pendingAchievement: AchievementDefinition | null;
  onCloseAchievement: () => void;
  pendingTrial: BossTrialId | null;
  onCompleteBossTrial: () => void;
  onSkipBossTrial: () => void;
};

type Props = InlineProps | FloatingProps;

export default function AppPopups(props: Props) {
  if (props.placement === "inline") {
    return (
      <SeasonCompletePopup
        isOpen={Boolean(props.pendingSeasonComplete)}
        season={null}
        rewards={{ xp: 1000, body: 5, mind: 5, work: 5, badge: "Iron Legend" }}
        isClaimed={props.completedSeasons.some((s) => s.week === 24)}
        onClaim={props.onClaimSeason}
        onClose={props.onCloseSeason}
      />
    );
  }

  const trial = props.pendingTrial
    ? getBossTrialByWeek(props.week)
    : null;

  return (
    <>
      <WeekCompletePopup
        isOpen={props.showWeekPopup}
        week={props.week}
        phase={props.phase}
        onClose={props.onCloseWeekPopup}
      />

      <WorkoutPopup
        isOpen={props.showPopup}
        xpReward={props.lastXpReward}
        onClose={props.onCloseWorkoutPopup}
      />

      <LevelUpPopup
        isOpen={props.leveledUp}
        level={props.level}
        rank={props.rank}
        onClose={props.onCloseLevelUp}
      />

      <AchievementPopup
        isOpen={Boolean(props.pendingAchievement)}
        achievement={props.pendingAchievement}
        onClose={props.onCloseAchievement}
      />

      <BossTrialPopup
        isOpen={Boolean(props.pendingTrial)}
        trial={trial}
        onComplete={props.onCompleteBossTrial}
        onSkip={props.onSkipBossTrial}
      />
    </>
  );
}
