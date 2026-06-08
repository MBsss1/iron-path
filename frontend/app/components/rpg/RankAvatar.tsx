"use client";

import { useEffect, useState } from "react";
import { getAvatar } from "../../data/avatar";
import { getRankAvatar } from "../../data/playerRanks";

type Props = {
  level: number;
  avatarId?: string;
  className?: string;
};

export default function RankAvatar({ level, avatarId, className = "" }: Props) {
  const fallbackSrc = getAvatar(level, avatarId);
  const [src, setSrc] = useState(getRankAvatar(level));

  useEffect(() => {
    setSrc(getRankAvatar(level));
  }, [level]);

  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}
