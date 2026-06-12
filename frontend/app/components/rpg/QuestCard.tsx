"use client";

import { useCallback, useState, type ReactNode } from "react";
import AnimatedProgressFill from "../../animations/AnimatedProgressFill";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

export type QuestCardStatus = "available" | "completed" | "locked" | "neutral";

type Props = {
  icon?: string;
  title: string;
  subtitle?: string;
  reward?: ReactNode;
  status?: QuestCardStatus;
  progress?: number;
  actionLabel?: string;
  onAction?: () => void;
  questStart?: boolean;
  disabled?: boolean;
  variant?: "main" | "side";
  meta?: ReactNode;
  className?: string;
};

export default function QuestCard({
  icon,
  title,
  subtitle,
  reward,
  status = "available",
  progress,
  actionLabel,
  onAction,
  questStart = false,
  disabled = false,
  variant = "side",
  meta,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [btnPress, setBtnPress] = useState(false);
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isMain = variant === "main";

  const runAction = useCallback(() => {
    if (!onAction || disabled) return;
    if (questStart && !reduced) {
      setBtnPress(true);
      window.setTimeout(() => {
        setBtnPress(false);
        onAction();
      }, 140);
      return;
    }
    onAction();
  }, [onAction, disabled, questStart, reduced]);

  const frameClass = [
    "iron-quest-card",
    isMain ? "iron-quest-card-main" : "",
    isCompleted ? "iron-quest-card-done" : "",
    isLocked ? "iron-quest-card-locked" : "",
    onAction && !disabled && !isCompleted && !actionLabel
      ? "iron-quest-card-interactive"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      <div className="flex gap-3 items-start">
        {icon && (
          <span
            className="iron-quest-icon shrink-0"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`iron-heading leading-snug ${
                isMain ? "text-base sm:text-lg" : "text-sm"
              } ${isCompleted ? "text-iron-muted line-through decoration-iron-border" : "text-iron-text"}`}
            >
              {title}
            </h3>
            {reward && <div className="shrink-0">{reward}</div>}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-iron-muted leading-relaxed">
              {subtitle}
            </p>
          )}
          {meta && <div className="mt-2 text-xs text-iron-text">{meta}</div>}
        </div>
        {isCompleted && (
          <span className="iron-quest-seal shrink-0" aria-hidden="true">
            ✓
          </span>
        )}
        {isLocked && (
          <span className="text-iron-muted shrink-0 text-sm" aria-hidden="true">
            🔒
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3 w-full h-1.5 iron-progress-track overflow-hidden rounded-sm">
          <AnimatedProgressFill percent={progress} />
        </div>
      )}

      {actionLabel && onAction && !isCompleted && !isLocked && (
        <button
          type="button"
          onClick={runAction}
          disabled={disabled}
          className={`iron-interactive w-full mt-3 py-2.5 text-sm font-semibold rounded-sm min-h-[48px] ${
            isMain ? "iron-btn-primary" : "iron-btn-secondary"
          } ${btnPress ? "iron-btn-quest-press" : ""}`}
        >
          {actionLabel}
        </button>
      )}
    </>
  );

  if (onAction && !isCompleted && !isLocked && !actionLabel) {
    return (
      <button
        type="button"
        onClick={runAction}
        disabled={disabled}
        className={`${frameClass} w-full text-left`}
      >
        {body}
      </button>
    );
  }

  return <div className={frameClass}>{body}</div>;
}
