"use client";

import { useState } from "react";
import { useDailyPersonalTasks } from "../../hooks/useDailyPersonalTasks";
import { useTranslation } from "../../i18n/useTranslation";

type Props = {
  compact?: boolean;
};

export default function TodayPersonalTasksBlock({ compact = false }: Props) {
  const { t } = useTranslation();
  const { tasks, loaded, addTask, toggleTask, removeTask } = useDailyPersonalTasks();
  const [input, setInput] = useState("");

  if (!loaded) return null;

  const handleAdd = () => {
    addTask(input);
    setInput("");
  };

  return (
    <div
      className={`border border-iron-border rounded-sm iron-card-panel ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="iron-label">{t("today.personalTasksTitle")}</p>
      {!compact && (
        <p className="text-xs text-iron-muted mt-1">{t("today.personalTasksHint")}</p>
      )}

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("today.personalTasksPlaceholder")}
          className="flex-1 border border-iron-border p-2 bg-iron-panel text-iron-text text-sm min-h-[40px] rounded-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 px-3 py-2 text-xs font-bold uppercase border border-iron-border iron-interactive rounded-sm"
        >
          {t("today.personalTasksAdd")}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xs text-iron-muted mt-3">{t("today.personalTasksEmpty")}</p>
      ) : (
        <ul className={`space-y-2 ${compact ? "mt-2" : "mt-3"}`}>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 border-b border-iron-border pb-2 last:border-0"
            >
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="shrink-0 text-iron-accent font-bold"
                aria-label={task.completed ? t("common.done") : t("common.progress")}
              >
                {task.completed ? "✓" : "□"}
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.completed ? "line-through text-iron-muted" : "text-iron-text"
                }`}
              >
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => removeTask(task.id)}
                className="text-xs text-iron-muted hover:text-iron-danger uppercase"
              >
                {t("today.personalTasksRemove")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
