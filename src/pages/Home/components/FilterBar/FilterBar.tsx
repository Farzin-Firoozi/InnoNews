import FilterPills from '../FilterPills'

import type { FilterBarProps } from '@/types/home'
import { ARTICLE_CATEGORIES } from '@/types/article'

const FilterBar = ({ filters }: { filters: FilterBarProps }) => {
  return (
    <section className="flex flex-col gap-5">
      <FilterPills categories={ARTICLE_CATEGORIES} {...filters} />
    </section>
  )
}

export default FilterBar
