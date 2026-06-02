import type { ClassDefinition } from "../data/classes";
import {
  translateClassBonuses,
  translateClassDescription,
  translateClassFocus,
  translateClassName,
} from "../i18n/labels";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
  classDef: ClassDefinition;
  selected: boolean;
  onSelect: () => void;
};

export default function ClassCard({ classDef, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const bonuses = translateClassBonuses(classDef.id, t);
  const focus = translateClassFocus(classDef.id, t);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border p-4 sm:p-5 text-left iron-interactive min-h-[48px] rounded-sm ${
        selected
          ? "bg-iron-accent-dim/90 text-iron-bg border-iron-accent"
          : "iron-card-raised text-iron-text border-iron-border hover:border-iron-accent-dim/50"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none" aria-hidden="true">
          {classDef.icon}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-iron-accent-dim">
            {t("classSelect.focusLabel", { focus })}
          </p>
          <h3 className="iron-heading text-xl mt-1">
            {translateClassName(classDef.id, t)}
          </h3>
          <p className="text-sm mt-2 leading-relaxed text-iron-muted">
            {translateClassDescription(classDef.id, t)}
          </p>

          <ul className="mt-3 space-y-1">
            {bonuses.map((bonus) => (
              <li key={bonus} className="text-xs font-medium text-iron-text">
                • {bonus}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}
