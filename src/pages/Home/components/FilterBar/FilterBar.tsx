import { ARTICLE_CATEGORIES } from '@/types/article'
import type { FilterBarProps } from '@/types/home'

import FilterPills from '../FilterPills'

const FilterBar = ({ filters }: { filters: FilterBarProps }) => {
  return (
    <section className="flex flex-col gap-5">
      <FilterPills categories={ARTICLE_CATEGORIES} {...filters} />
    </section>
  )
}

export default FilterBar
