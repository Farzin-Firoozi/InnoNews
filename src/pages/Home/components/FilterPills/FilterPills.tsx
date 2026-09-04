import { X } from 'lucide-react'

import Chip from '@/components/Chip'
import DateField from '@/components/DateField'

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

  const dateRange = (
    <div className="flex w-full flex-col gap-2 md:order-1 md:shrink-0">
      <span className="text-xs font-medium tracking-widest text-stone-500 uppercase">
        Date range
      </span>
      <div className="focus-within:border-brand flex h-9 w-full shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 pr-2 pl-3.5 transition">
        <span className="flex w-full items-center gap-1.5">
          <span className="translate-y-px text-xs text-stone-500">From</span>
          <DateField
            value={dateFrom}
            onChange={(value) => onDateChange({ from: value, to: dateTo })}
            placeholder="Any date"
            aria-label="From date"
          />
        </span>
        <span className="text-stone-300">–</span>
        <span className="flex w-full items-center gap-1.5">
          <span className="translate-y-px text-xs text-stone-500">To</span>
          <DateField
            value={dateTo}
            onChange={(value) => onDateChange({ from: dateFrom, to: value })}
            placeholder="Any date"
            aria-label="To date"
          />
        </span>
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
  )

  return (
    <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-x-8 md:gap-y-6">
      <div className="flex flex-col gap-5 md:order-2 md:w-full md:shrink-0 md:flex-row md:items-center md:justify-between">
        <ChipRow
          label="Source"
          options={sourceOptions}
          selected={selectedSources}
          onToggle={onToggleSource}
          onClear={onClearSources}
        />

        <div className="w-full md:w-auto">{dateRange}</div>
      </div>
      <div className="md:order-3 md:basis-full">
        <ChipRow
          label="Category"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={onToggleCategory}
          onClear={onClearCategories}
        />
      </div>
      {isLoadingAuthors ? (
        <div className="md:order-4 md:basis-full">
          <FilterPillsSkeleton label="Author" />
        </div>
      ) : (
        (authorOptions.length > 0 || selectedAuthors.length > 0) && (
          <div className="md:order-4 md:basis-full">
            <ChipRow
              label="Author"
              options={authorOptions}
              selected={selectedAuthors}
              onToggle={onToggleAuthor}
              onClear={onClearAuthors}
            />
          </div>
        )
      )}
    </div>
  )
}

export default FilterPills
