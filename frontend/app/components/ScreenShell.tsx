import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backLabel?: string;
  onBack?: () => void;
  children: ReactNode;
};

export default function ScreenShell({
  eyebrow,
  title,
  subtitle,
  backLabel = "Back",
  onBack,
  children,
}: Props) {
  return (
    <div className="mt-6 sm:mt-8 iron-shell-card p-5 sm:p-6 mb-24">
      {(onBack || eyebrow || title) && (
        <div className={`${onBack ? "flex items-start justify-between gap-4" : ""}`}>
          <div className={`${onBack ? "flex-1" : ""}`}>
            {eyebrow && <p className="iron-label">{eyebrow}</p>}
            <h2 className="iron-heading text-2xl sm:text-3xl mt-1">{title}</h2>
            {subtitle && (
              <p className="mt-1.5 text-sm text-iron-muted normal-case">{subtitle}</p>
            )}
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="iron-interactive iron-btn-ghost px-3 py-2 text-xs font-semibold shrink-0 rounded-sm"
            >
              {backLabel}
            </button>
          )}
        </div>
      )}

      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
