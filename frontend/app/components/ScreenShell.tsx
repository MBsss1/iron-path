"use client";

import { ReactNode } from "react";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
};

export default function ScreenShell({
  eyebrow,
  title,
  subtitle,
  onBack,
  children,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 sm:mt-8 iron-shell-card p-5 sm:p-6 mb-24">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="iron-interactive -ml-1 mb-3 text-sm text-iron-muted hover:text-iron-text font-medium"
        >
          ← {t("common.back")}
        </button>
      )}

      {(eyebrow || title) && (
        <div>
          {eyebrow && <p className="iron-label">{eyebrow}</p>}
          <h2 className="iron-heading text-2xl sm:text-3xl mt-1">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 text-sm text-iron-muted normal-case">{subtitle}</p>
          )}
        </div>
      )}

      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}