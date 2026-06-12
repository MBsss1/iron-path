"use client";

import { useTranslation } from "../../i18n/useTranslation";
import IronButton from "../IronButton";

type Props = {
  onRetake: () => void;
  onDismiss: () => void;
  variant?: "default" | "adaptation";
};

export default function ReassessmentPromptBlock({
  onRetake,
  onDismiss,
  variant = "default",
}: Props) {
  const { t } = useTranslation();
  const titleKey =
    variant === "adaptation"
      ? "coaching.reassessment.adaptationTitle"
      : "coaching.reassessment.title";
  const bodyKey =
    variant === "adaptation"
      ? "coaching.reassessment.adaptationBody"
      : "coaching.reassessment.body";

  return (
    <div className="border border-iron-accent-dim/50 iron-card-accent p-4 rounded-sm space-y-3">
      <p className="iron-label">{t(titleKey)}</p>
      <p className="text-sm text-iron-text leading-relaxed">
        {t(bodyKey)}
      </p>
      <p className="text-xs text-iron-muted">{t("coaching.reassessment.hint")}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="iron-interactive py-2.5 text-xs font-bold uppercase border border-iron-border rounded-sm"
        >
          {t("coaching.reassessment.later")}
        </button>
        <IronButton onClick={onRetake} className="py-2.5 text-xs">
          {t("coaching.reassessment.cta")}
        </IronButton>
      </div>
    </div>
  );
}
