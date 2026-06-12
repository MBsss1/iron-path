"use client";

import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  amount: number | string;
  suffix?: string;
  variant?: "gold" | "muted";
  pulse?: boolean;
  className?: string;
};

export default function RewardChip({
  amount,
  suffix,
  variant = "gold",
  pulse = false,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const label = suffix ?? t("common.xp");

  return (
    <span
      className={`iron-reward-chip ${variant === "muted" ? "iron-reward-chip-muted" : ""} ${
        pulse ? "iron-reward-chip-pulse" : ""
      } ${className}`.trim()}
    >
      +{amount} {label}
    </span>
  );
}
