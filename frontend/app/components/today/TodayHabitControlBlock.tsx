"use client";

import { useState } from "react";
import { useHabitControl } from "../../hooks/useHabitControl";
import { useTranslation } from "../../i18n/useTranslation";

export default function TodayHabitControlBlock() {
  const { t } = useTranslation();
  const { habits, loaded, addHabit, removeHabit, toggleSlipFreeToday, isSlipFreeToday } =
    useHabitControl();
  const [input, setInput] = useState("");

  if (!loaded) return null;

  const handleAdd = () => {
    addHabit(input);
    setInput("");
  };

  return (
    <div className="border border-iron-border p-4 rounded-sm iron-card-raised">
      <p className="iron-label">{t("today.habitControlTitle")}</p>
      <p className="text-xs text-iron-muted mt-1">{t("today.habitControlHint")}</p>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("today.habitControlPlaceholder")}
          className="flex-1 border border-iron-border p-2 bg-iron-panel text-iron-text text-sm min-h-[40px] rounded-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 px-3 py-2 text-xs font-bold uppercase border border-iron-border iron-interactive rounded-sm"
        >
          {t("today.habitControlAdd")}
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="text-xs text-iron-muted mt-3">{t("today.habitControlEmpty")}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {habits.map((habit) => {
            const clean = isSlipFreeToday(habit.id);
            return (
              <li
                key={habit.id}
                className="border border-iron-border p-3 iron-card-panel flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-semibold text-iron-text">{habit.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSlipFreeToday(habit.id)}
                    className={`text-xs font-bold uppercase px-2 py-1 border rounded-sm ${
                      clean
                        ? "border-iron-accent text-iron-accent bg-iron-accent-dim/20"
                        : "border-iron-border text-iron-muted"
                    }`}
                  >
                    {clean
                      ? t("today.habitControlClean")
                      : t("today.habitControlMarkClean")}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHabit(habit.id)}
                    className="text-xs text-iron-muted hover:text-iron-danger uppercase"
                  >
                    {t("today.habitControlRemove")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
