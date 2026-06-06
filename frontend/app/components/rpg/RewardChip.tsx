"use client";

import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  amount: number | string;
  suffix?: string;
  variant?: "gold" | "muted";
  className?: string;
};

export default function RewardChip({
  amount,
  suffix,
  variant = "gold",
  className = "",
}: Props) {
  const { t } = useTranslation();
  const label = suffix ?? t("common.xp");

  return (
    <span
      className={`iron-reward-chip ${variant === "muted" ? "iron-reward-chip-muted" : ""} ${className}`.trim()}
    >
      +{amount} {label}
    </span>
  );
}
