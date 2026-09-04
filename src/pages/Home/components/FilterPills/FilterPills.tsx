import { X } from 'lucide-react'

import Chip from '@/components/Chip'

import type { ArticleSource } from '@/types/article'
import { ARTICLE_SOURCES, SOURCE_LABELS } from '@/types/article'
import type { HomeFilters } from '@/types/home'

import FilterPillsSkeleton from './FilterPills.skeleton'

type ChipRowProps = {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

const ChipRow = ({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: ChipRowProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-widest text-stone-500 uppercase">
        {label}
      </span>
      <div className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        <Chip pressed={selected.length === 0} onClick={onClear}>
          All
        </Chip>
        {options.map((option) => {
          const isActive = selected.includes(option.value)
          return (
            <Chip
              key={option.value}
              pressed={isActive}
              onClick={() => onToggle(option.value)}
            >
              {option.label}
            </Chip>
          )
        })}
      </div>
    </div>
  )
}

type FilterPillsProps = HomeFilters & {
  categories: readonly string[]
}

const dateInputClass =
  'min-w-0 bg-transparent text-sm text-stone-700 outline-none [color-scheme:light] placeholder:text-stone-400'

const FilterPills = ({
  categories,
  authors,
  isLoadingAuthors,
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
}: FilterPillsProps) => {
  const sourceOptions = ARTICLE_SOURCES.map((source: ArticleSource) => ({
    value: source,
    label: SOURCE_LABELS[source],
  }))
  // A category can arrive selected (URL/localStorage/breadcrumb link) that
  // isn't in the fixed pill list — e.g. a source's own category string that
  // doesn't map onto ARTICLE_CATEGORIES. Surface it as a pill anyway, first
  // in the row, so it's never silently un-selectable.
  const extraCategories = selectedCategories.filter(
    (category) => !categories.includes(category),
  )
  const categoryOptions = [...extraCategories, ...categories].map(
    (category) => ({
      value: category,
      label: category,
    }),
  )
  const authorOptions = authors.map((author) => ({
    value: author,
    label: author,
  }))

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
      {isLoadingAuthors ? (
        <FilterPillsSkeleton label="Author" />
      ) : (
        (authorOptions.length > 0 || selectedAuthors.length > 0) && (
          <ChipRow
            label="Author"
            options={authorOptions}
            selected={selectedAuthors}
            onToggle={onToggleAuthor}
            onClear={onClearAuthors}
          />
        )
      )}

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-[0.1em] text-stone-500 uppercase">
          Date range
        </span>
        <div className="focus-within:border-brand flex w-fit shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 py-1.5 pr-2 pl-3.5 transition">
          <label className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500">From</span>
            <input
              type="date"
              className={dateInputClass}
              value={dateFrom}
              onChange={(e) =>
                onDateChange({ from: e.target.value, to: dateTo })
              }
            />
          </label>
          <span className="text-stone-300">–</span>
          <label className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500">To</span>
            <input
              type="date"
              className={dateInputClass}
              value={dateTo}
              onChange={(e) =>
                onDateChange({ from: dateFrom, to: e.target.value })
              }
            />
          </label>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => onDateChange({ from: '', to: '' })}
              aria-label="Clear date range"
              className="hover:text-brand ml-1 rounded-full p-1 text-stone-400 transition hover:bg-white"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterPills
