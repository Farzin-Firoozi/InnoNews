import { FilterPills, type PillFilter } from '@/components/site/FilterPills'

import { ARTICLE_CATEGORIES } from '@/types/article'
import type { ArticleFilters } from '@/types/article'

export type { PillFilter }

type FilterBarProps = {
  active: PillFilter | null
  onSelect: (pill: PillFilter) => void
  dateFrom: string
  dateTo: string
  onDateChange: (patch: Pick<ArticleFilters, 'from' | 'to'>) => void
}

const FilterBar = ({
  active,
  onSelect,
  dateFrom,
  dateTo,
  onDateChange,
}: FilterBarProps) => {
  return (
    <section className="flex flex-col gap-5">
      <FilterPills
        categories={ARTICLE_CATEGORIES}
        active={active}
        onSelect={onSelect}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={onDateChange}
      />
    </section>
  )
}

export default FilterBar
