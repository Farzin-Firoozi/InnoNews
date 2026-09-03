import { ARTICLE_SOURCES, SOURCE_LABELS } from "../../types/article";
import type { ArticleFilters } from "../../types/article";

export type PillFilter = { type: "source" | "category"; value: string };

interface FilterPillsProps {
  categories: readonly string[];
  active: PillFilter | null;
  onSelect: (pill: PillFilter) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (patch: Pick<ArticleFilters, "from" | "to">) => void;
}

const dateInputClass =
  "rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-700 focus:border-red-600 focus:outline-none";

export function FilterPills({
  categories,
  active,
  onSelect,
  dateFrom,
  dateTo,
  onDateChange,
}: FilterPillsProps) {
  const pills: PillFilter[] = [
    ...ARTICLE_SOURCES.map((source) => ({ type: "source" as const, value: source })),
    ...categories.map((category) => ({ type: "category" as const, value: category })),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="scrollbar-none flex gap-5 overflow-x-auto pb-1">
        {pills.map((pill) => {
          const isActive =
            active?.type === pill.type && active.value === pill.value;
          const label =
            pill.type === "source"
              ? SOURCE_LABELS[pill.value as keyof typeof SOURCE_LABELS]
              : pill.value;
          const letter = label.charAt(0).toUpperCase();

          return (
            <button
              key={`${pill.type}:${pill.value}`}
              type="button"
              onClick={() => onSelect(pill)}
              className="flex shrink-0 flex-col items-center gap-1.5"
              aria-pressed={isActive}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-oranienbaum text-sm transition ${
                  isActive
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:border-red-600/50"
                }`}
              >
                {letter}
              </span>
              <span
                className={`max-w-[4.5rem] truncate text-[11px] capitalize ${
                  isActive ? "font-medium text-red-600" : "text-stone-500"
                }`}
              >
                {pill.type === "source" ? label : pill.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <label className="flex items-center gap-1.5 text-[11px] text-stone-500">
          From
          <input
            type="date"
            className={dateInputClass}
            value={dateFrom}
            onChange={(e) => onDateChange({ from: e.target.value, to: dateTo })}
          />
        </label>
        <label className="flex items-center gap-1.5 text-[11px] text-stone-500">
          To
          <input
            type="date"
            className={dateInputClass}
            value={dateTo}
            onChange={(e) => onDateChange({ from: dateFrom, to: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
