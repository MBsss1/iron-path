"use client";

import type { PathMode } from "../data/pathMode";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  mode: PathMode | null;
  onClose: () => void;
};

export default function PathModeDetailsModal({ mode, onClose }: Props) {
  const { t } = useTranslation();

  if (!mode) return null;

  const bullets = [0, 1, 2, 3, 4]
    .map((i) => t(`pathMode.details.${mode}.bullet${i}`))
    .filter((text) => text.length > 0 && !text.startsWith("pathMode.details."));

  return (
    <div
      className="fixed inset-0 iron-modal-overlay flex items-center justify-center z-50 p-4 animate-overlay-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="iron-modal iron-card-panel p-5 w-full max-w-sm max-h-[85vh] overflow-y-auto animate-modal-enter">
        <p className="iron-label">{t("pathMode.detailsLabel")}</p>
        <h3 className="iron-heading text-xl mt-2">{t(`pathMode.${mode}.title`)}</h3>
        <ul className="mt-4 space-y-2 text-sm text-iron-text leading-relaxed list-disc pl-5">
          {bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="iron-interactive w-full mt-6 py-3 text-sm font-semibold border border-iron-border rounded-sm"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
}
