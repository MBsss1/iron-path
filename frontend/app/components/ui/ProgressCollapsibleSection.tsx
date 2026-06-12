"use client";

import { useId, useState, type ReactNode } from "react";
import { sectionReveal } from "../../animations/classes";
import { usePrefersReducedMotion } from "../../animations/usePrefersReducedMotion";

type Props = {
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function ProgressCollapsibleSection({
  title,
  hint,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = usePrefersReducedMotion();
  const panelId = useId();

  return (
    <div className="border border-iron-border rounded-sm overflow-hidden bg-iron-panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="iron-interactive w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="min-w-0">
          <p className="font-bold text-sm text-iron-text">{title}</p>
          {hint && !open && (
            <p className="text-xs text-iron-muted mt-0.5 truncate">{hint}</p>
          )}
        </div>
        <span
          className={`shrink-0 text-iron-muted text-xs transition-transform ${
            reduced ? "" : "duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]"
          } ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <div
        id={panelId}
        className={`grid ${
          reduced
            ? ""
            : "transition-[grid-template-rows] duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-out)]"
        } ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className={`px-4 pb-4 pt-0 border-t border-iron-border/60 ${
              reduced
                ? ""
                : `transition-[opacity,transform] duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-out)] ${
                    open
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-1"
                  } ${open && !reduced ? sectionReveal : ""}`
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
