import { X } from 'lucide-react'

import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

import type { ArticleSource } from '../../types/article'
import { ARTICLE_SOURCES, SOURCE_LABELS } from '../../types/article'

/** Fixed widths so the skeleton occupies the same footprint an average
 * author-name chip would, avoiding layout shift once real data loads. */
const AUTHOR_CHIP_SKELETON_WIDTHS = ['w-24', 'w-16', 'w-28', 'w-20', 'w-16']

function ChipRowSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-[0.1em] text-stone-500 uppercase">
        {label}
      </span>
      <div className="flex gap-2 overflow-hidden pb-1">
        <Skeleton className="h-[34px] w-14 shrink-0 rounded-full" />
        {AUTHOR_CHIP_SKELETON_WIDTHS.map((width, i) => (
          <Skeleton
            key={i}
            className={`h-[34px] ${width} shrink-0 rounded-full`}
          />
        ))}
      </div>
    </div>
  )
}

interface ChipRowProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

function ChipRow({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: ChipRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-widest text-stone-500 uppercase">
        {label}
      </span>
      <div className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        <button
          type="button"
          onClick={onClear}
          aria-pressed={selected.length === 0}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm capitalize transition ${
            selected.length === 0
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-blue-600/50'
          }`}
        >
          All
        </button>
        {options.map((option) => {
          const isActive = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={isActive}
              className={cn(
                'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm capitalize transition',
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-blue-600/50',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface FilterPillsProps {
  categories: readonly string[]
  authors: string[]
  isLoadingAuthors: boolean
  selectedSources: string[]
  selectedCategories: string[]
  selectedAuthors: string[]
  onToggleSource: (value: string) => void
  onToggleCategory: (value: string) => void
  onToggleAuthor: (value: string) => void
  onClearSources: () => void
  onClearCategories: () => void
  onClearAuthors: () => void
  dateFrom: string
  dateTo: string
  onDateChange: (patch: { from?: string; to?: string }) => void
}

const dateInputClass =
  'min-w-0 bg-transparent text-sm text-stone-700 outline-none [color-scheme:light] placeholder:text-stone-400'

export function FilterPills({
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
}: FilterPillsProps) {
  const sourceOptions = ARTICLE_SOURCES.map((source: ArticleSource) => ({
    value: source,
    label: SOURCE_LABELS[source],
  }))
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }))
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
        <ChipRowSkeleton label="Author" />
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
        <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 py-1.5 pr-2 pl-3.5 transition focus-within:border-blue-600">
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
              className="ml-1 rounded-full p-1 text-stone-400 transition hover:bg-white hover:text-blue-600"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
