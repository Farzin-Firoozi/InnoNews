import { ARTICLE_SOURCES, SOURCE_LABELS } from "../../types/article";
import type { ArticleSource } from "../../types/article";

interface ChipRowProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

function ChipRow({ label, options, selected, onToggle, onClear }: ChipRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-[0.1em] text-stone-500 uppercase">
        {label}
      </span>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={onClear}
          aria-pressed={selected.length === 0}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
            selected.length === 0
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-stone-200 bg-stone-50 text-stone-700 hover:border-blue-600/50"
          }`}
        >
          All
        </button>
        {options.map((option) => {
          const isActive = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:border-blue-600/50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FilterPillsProps {
  categories: readonly string[];
  authors: string[];
  selectedSources: string[];
  selectedCategories: string[];
  selectedAuthors: string[];
  onToggleSource: (value: string) => void;
  onToggleCategory: (value: string) => void;
  onToggleAuthor: (value: string) => void;
  onClearSources: () => void;
  onClearCategories: () => void;
  onClearAuthors: () => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (patch: { from?: string; to?: string }) => void;
}

const dateInputClass =
  "rounded-md border border-stone-200 bg-white px-2 py-1.5 text-xs text-stone-700 focus:border-blue-600 focus:outline-none";

export function FilterPills({
  categories,
  authors,
  selectedSources,
  selectedCategories,
  selectedAuthors,
  onToggleSource,
  onToggleCategory,
  onToggleAuthor,
  onClearSources,
  onClearCategories,
  onClearAuthors,
  dateFrom,
  dateTo,
  onDateChange,
}: FilterPillsProps) {
  const sourceOptions = ARTICLE_SOURCES.map((source: ArticleSource) => ({
    value: source,
    label: SOURCE_LABELS[source],
  }));
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));
  const authorOptions = authors.map((author) => ({
    value: author,
    label: author,
  }));

  return (
    <div className="flex flex-col gap-5">
      <ChipRow
        label="Source"
        options={sourceOptions}
        selected={selectedSources}
        onToggle={onToggleSource}
        onClear={onClearSources}
      />
      <ChipRow
        label="Category"
        options={categoryOptions}
        selected={selectedCategories}
        onToggle={onToggleCategory}
        onClear={onClearCategories}
      />
      {authorOptions.length > 0 && (
        <ChipRow
          label="Author"
          options={authorOptions}
          selected={selectedAuthors}
          onToggle={onToggleAuthor}
          onClear={onClearAuthors}
        />
      )}

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
