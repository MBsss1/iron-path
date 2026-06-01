"use client";

import { useState } from "react";
import { CLASSES, type ClassId } from "../data/classes";
import ClassCard from "./ClassCard";
import ScreenShell from "./ScreenShell";
import IronButton from "./IronButton";

type Props = {
  onConfirm: (classId: ClassId) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
};

export default function ClassSelectionScreen({
  onConfirm,
  onClose,
  title = "Choose Your Class",
  subtitle = "Your class defines how you grow on the Iron Path",
}: Props) {
  const [selected, setSelected] = useState<ClassId>("warrior");

  return (
    <ScreenShell
      eyebrow="Character"
      title={title}
      subtitle={subtitle}
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

      <IronButton onClick={() => onConfirm(selected)}>Confirm Class</IronButton>
    </ScreenShell>
  );
}
