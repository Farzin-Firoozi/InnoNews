import { FilterPills } from '@/components/site/FilterPills'

import { ARTICLE_CATEGORIES } from '@/types/article'

type FilterBarProps = {
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

const FilterBar = ({
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
}: FilterBarProps) => {
  return (
    <section className="flex flex-col gap-5">
      <FilterPills
        categories={ARTICLE_CATEGORIES}
        authors={authors}
        isLoadingAuthors={isLoadingAuthors}
        selectedSources={selectedSources}
        selectedCategories={selectedCategories}
        selectedAuthors={selectedAuthors}
        onToggleSource={onToggleSource}
        onToggleCategory={onToggleCategory}
        onToggleAuthor={onToggleAuthor}
        onClearSources={onClearSources}
        onClearCategories={onClearCategories}
        onClearAuthors={onClearAuthors}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={onDateChange}
      />
    </section>
  )
}

export default FilterBar
