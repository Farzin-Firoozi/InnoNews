import type { HomeFilters } from '@/types/home'

import { useAvailableAuthors } from './useAvailableAuthors'
import { useFilterParams } from './useFilterParams'
import { useHomeContent } from './useHomeContent'

/** Composes the homepage's three concerns — filter selection, article
 * queries/content, and the derived author options — into the props the page
 * renders. */
export function useHomePage() {
  const {
    activeFilters,
    selectedAuthors,
    isFiltering,
    isCuratedOnly,
    controls,
  } = useFilterParams()

  const { content, authorArticles, isLoadingAuthors } = useHomeContent(
    activeFilters,
    isFiltering,
    isCuratedOnly,
  )

  const authors = useAvailableAuthors(authorArticles, selectedAuthors)

  const filters: HomeFilters = { ...controls, authors, isLoadingAuthors }

  return { filters, content }
}
