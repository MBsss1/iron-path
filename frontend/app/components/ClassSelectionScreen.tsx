"use client";

import { useState } from "react";
import { CLASSES, type ClassId } from "../data/classes";
import ClassCard from "./ClassCard";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  onConfirm: (classId: ClassId) => void;
  onClose?: () => void;
};

export default function ClassSelectionScreen({ onConfirm, onClose }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ClassId>("warrior");

  return (
    <ScreenShell
      eyebrow={t("classSelect.eyebrow")}
      title={t("classSelect.title")}
      subtitle={t("classSelect.subtitle")}
      onBack={onClose}
    >
      <div className="space-y-3">
        {CLASSES.map((classDef) => (
          <ClassCard
            key={classDef.id}
            classDef={classDef}
            selected={selected === classDef.id}
            onSelect={() => setSelected(classDef.id)}
          />
        ))}
      </div>

      <IronButton onClick={() => onConfirm(selected)}>
        {t("classSelect.confirm")}
      </IronButton>
    </ScreenShell>
  );
}
