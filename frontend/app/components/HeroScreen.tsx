"use client";

import WeekProgress from "./WeekProgress";
import { getRank, getNextRank } from "../data/ranks";
import { getAvatar } from "../data/avatar";
import { user } from "../data/user";
import DailyMissionTracker from "./DailyMissionTracker";
import StreakCalendar from "./StreakCalendar";
import SeasonProgress from "./SeasonProgress";
import type { Profile } from "../hooks/useProfile";
import type { DailyMission } from "../hooks/useDailyMissions";

type Props = {
  profile: Profile;
  level: number;
  xp: number;
  body: number;
  mind: number;
  work: number;
  week: number;
  program: { phase: string };
  missions: DailyMission[];
  completedCount: number;
  totalCount: number;
  progress: number;
  streak: number;
};

export default function HeroScreen({
  profile,
  level,
  xp,
  body,
  mind,
  work,
  week,
  program,
  missions,
  completedCount,
  totalCount,
  progress,
  streak,
}: Props) {
  return (
    <>
      <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl">
        <div className="flex flex-col items-center">
          <img
            src={getAvatar(level, profile.avatarId)}
            alt="Avatar"
            className="w-56 sm:w-64 h-72 sm:h-80 object-cover border-4 border-black"
          />

          <h2 className="text-4xl font-black mt-6">LEVEL {level}</h2>

          <p className="uppercase tracking-widest mt-2">{getRank(level)}</p>
          <div className="mt-3 w-full grid grid-cols-2 gap-3">
            <div className="border-2 border-black px-4 py-3 bg-[#e8d8b0] text-center">
              <p className="text-xs uppercase font-bold tracking-widest">
                Next Rank
              </p>
              <p className="text-sm uppercase font-black mt-1">
                {getNextRank(level)}
              </p>
            </div>

            <div className="border-2 border-black px-4 py-3 bg-black text-[#efe3c2] text-center">
              <p className="text-xs uppercase tracking-widest">Goal</p>
              <p className="font-black uppercase mt-1">
                {profile?.goal?.replace("_", " ")}
              </p>
            </div>
          </div>
          <WeekProgress week={week} />
          <div className="mt-3 border-2 border-black px-4 py-3 bg-black text-[#efe3c2] text-center">
            <p className="text-xs uppercase tracking-widest">Current Phase</p>

            <p className="font-black uppercase">{program.phase}</p>
          </div>

          <div className="w-full mt-6">
            <div className="flex justify-between text-sm font-bold">
              <span>XP</span>
              <span>
                {xp} / {user.maxXp}
              </span>
            </div>

            <div className="w-full h-4 border-2 border-black mt-2">
              <div
                className="h-full bg-red-700 transition-all duration-500"
                style={{
                  width: `${(xp / user.maxXp) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 w-full border-2 border-black p-4 bg-black text-[#efe3c2]">
            <div className="flex justify-between uppercase text-sm">
              <span>Weight</span>
              <span>{profile?.weight} KG</span>
            </div>

            <div className="flex justify-between uppercase text-sm mt-2">
              <span>Recovery</span>
              <span>{user.recovery}%</span>
            </div>
            <div className="flex justify-between uppercase text-sm mt-2">
              <span>Watch</span>
              <span>{profile?.watchType}</span>
            </div>

            <div className="flex justify-between uppercase text-sm mt-2">
              <span>Streak</span>
              <span>{streak} Days</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full mt-8 text-center">
            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Body</p>
              <p className="text-3xl font-black">{body}</p>
            </div>

            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Mind</p>
              <p className="text-3xl font-black">{mind}</p>
            </div>

            <div className="border-2 border-black p-3 bg-[#e8d8b0]">
              <p className="text-xs uppercase">Work</p>
              <p className="text-3xl font-black">{work}</p>
            </div>
          </div>

          <DailyMissionTracker
            missions={missions}
            completedCount={completedCount}
            totalCount={totalCount}
            progress={progress}
          />

          <StreakCalendar />
        </div>
      </div>

      <SeasonProgress week={week} />
    </>
  );
}
