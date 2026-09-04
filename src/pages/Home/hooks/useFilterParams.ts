import { useEffect, useMemo, useRef } from 'react'

import { preferencesAtom } from '@/state/preferences'
import { useAtom } from 'jotai'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import type { SelectedFilters } from '@/types/article'
import type { HomeFilters } from '@/types/home'

/** The filter UI props this hook owns — everything except the author option
 * list, which is derived from the fetched articles elsewhere. */
export type FilterControls = Omit<HomeFilters, 'authors' | 'isLoadingAuthors'>

function toggle(list: string[], value: string) {
  if (list.includes(value)) return list.filter((item) => item !== value)
  return [...list, value]
}

/**
 * Owns the filter selection: its URL param schema, one-time hydration from
 * saved preferences, persistence back to them, and the derived view-mode
 * predicates that say how the selection should be rendered.
 */
export function useFilterParams() {
  const [filterParams, setFilterParams] = useQueryStates({
    q: parseAsString.withDefault('').withOptions({ history: 'replace' }),
    from: parseAsString.withDefault(''),
    to: parseAsString.withDefault(''),
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    sources: parseAsArrayOf(parseAsString).withDefault([]),
    authors: parseAsArrayOf(parseAsString).withDefault([]),
  })

  const {
    q: query,
    from: dateFrom,
    to: dateTo,
    categories,
    sources,
    authors,
  } = filterParams

  const [preferences, setPreferences] = useAtom(preferencesAtom)

  // One-time hydration: if the URL arrived with no picks at all (a fresh
  // visit, not a shared link), restore the last saved preferences. Only
  // ever runs once, so it never fights a link's own params or later edits.
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    const urlHasPicks =
      sources.length > 0 || categories.length > 0 || authors.length > 0
    const prefsHavePicks =
      preferences.sources.length > 0 ||
      preferences.categories.length > 0 ||
      preferences.authors.length > 0

    if (!urlHasPicks && prefsHavePicks) {
      setFilterParams({
        sources: preferences.sources,
        categories: preferences.categories,
        authors: preferences.authors,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeFilters: SelectedFilters = useMemo(
    () => ({
      query: query.trim() || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      categories,
      sources,
      authors,
    }),
    [query, dateFrom, dateTo, categories, sources, authors],
  )

  const isFiltering =
    Boolean(activeFilters.query || activeFilters.from || activeFilters.to) ||
    categories.length > 0 ||
    sources.length > 0 ||
    authors.length > 0

  // Picking only sources and/or categories (no query/date/author) keeps
  // the familiar homepage layout — carousel, curated sections — instead
  // of dropping to the flat search-results grid.
  const isCuratedOnly =
    (sources.length > 0 || categories.length > 0) &&
    !activeFilters.query &&
    !activeFilters.from &&
    !activeFilters.to &&
    authors.length === 0

  const persistPicks = (
    key: 'sources' | 'categories' | 'authors',
    next: string[],
  ) => {
    setFilterParams({ [key]: next })
    setPreferences((prev) => ({ ...prev, [key]: next }))
  }

  const controls: FilterControls = {
    selectedSources: sources,
    selectedCategories: categories,
    selectedAuthors: authors,
    onToggleSource: (value: string) =>
      persistPicks('sources', toggle(sources, value)),
    onToggleCategory: (value: string) =>
      persistPicks('categories', toggle(categories, value)),
    onToggleAuthor: (value: string) =>
      persistPicks('authors', toggle(authors, value)),
    onClearSources: () => persistPicks('sources', []),
    onClearCategories: () => persistPicks('categories', []),
    onClearAuthors: () => persistPicks('authors', []),
    dateFrom,
    dateTo,
    onDateChange: ({ from, to }) => {
      setFilterParams({ from: from || null, to: to || null })
    },
  }

  return {
    activeFilters,
    selectedAuthors: authors,
    isFiltering,
    isCuratedOnly,
    controls,
  }
}
