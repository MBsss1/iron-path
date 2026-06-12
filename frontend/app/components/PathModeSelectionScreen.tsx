"use client";

import { useState } from "react";
import { PATH_MODES, type PathMode } from "../data/pathMode";
import { useTranslation } from "../i18n/useTranslation";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";
import PathModeDetailsModal from "./PathModeDetailsModal";

type Props = {
  onConfirm: (pathMode: PathMode) => void;
  onClose?: () => void;
};

export default function PathModeSelectionScreen({ onConfirm, onClose }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<PathMode>("balance");
  const [detailsMode, setDetailsMode] = useState<PathMode | null>(null);

  return (
    <>
      <ScreenShell
        eyebrow={t("pathMode.select.eyebrow")}
        title={t("pathMode.select.title")}
        subtitle={t("pathMode.select.subtitle")}
        onBack={onClose}
      >
        <div className="space-y-3">
          {PATH_MODES.map((mode) => {
            const isSelected = selected === mode;
            return (
              <div
                key={mode}
                className={`border p-4 rounded-sm ${
                  isSelected
                    ? "border-iron-accent bg-iron-accent-dim/20"
                    : "border-iron-border iron-card-raised"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(mode)}
                  className="w-full text-left iron-interactive"
                >
                  <h3 className="iron-heading text-lg">{t(`pathMode.${mode}.title`)}</h3>
                  <p className="text-sm text-iron-muted mt-2 leading-relaxed">
                    {t(`pathMode.${mode}.description`)}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsMode(mode)}
                  className="mt-3 text-xs font-bold uppercase text-iron-accent-dim hover:text-iron-accent"
                >
                  {t("pathMode.detailsButton")}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-iron-muted leading-relaxed mt-4">
          {t("pathMode.select.changeLaterNote")}
        </p>

        <IronButton onClick={() => onConfirm(selected)}>
          {t("pathMode.select.confirm")}
        </IronButton>
      </ScreenShell>

      <PathModeDetailsModal mode={detailsMode} onClose={() => setDetailsMode(null)} />
    </>
  );
}
