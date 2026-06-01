import type { ClassDefinition } from "../data/classes";

type Props = {
  classDef: ClassDefinition;
  selected: boolean;
  onSelect: () => void;
};

export default function ClassCard({ classDef, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border-4 border-black p-4 sm:p-5 text-left transition-transform active:scale-[0.98] min-h-[48px] ${
        selected ? "bg-[#b22222] text-[#efe3c2]" : "bg-[#e8d8b0] text-black"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none" aria-hidden="true">
          {classDef.icon}
        </span>

        <div className="flex-1 min-w-0">
          <p className="uppercase tracking-[0.15em] text-xs font-bold">
            Focus: {classDef.focus}
          </p>
          <h3 className="text-2xl font-black uppercase mt-1">{classDef.name}</h3>
          <p className="text-xs sm:text-sm mt-2 uppercase leading-relaxed opacity-90">
            {classDef.description}
          </p>

          <ul className="mt-3 space-y-1">
            {classDef.bonusSummary.map((bonus) => (
              <li key={bonus} className="text-xs font-bold uppercase">
                • {bonus}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}
