import { useEffect, useMemo, useRef } from 'react'

import { preferencesAtom } from '@/state/preferences'
import { useAtom } from 'jotai'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import type { SelectedFilters } from '@/types/article'
import type { FilterBarProps, HomeContent } from '@/types/home'

import { useArticles } from '@/hooks/useArticles'
import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'

const AUTHOR_OPTIONS_LIMIT = 12
const LOAD_ERROR = 'Failed to load articles.'

function toggle(list: string[], value: string) {
  if (list.includes(value)) return list.filter((item) => item !== value)
  return [...list, value]
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return LOAD_ERROR
}

export function useHomePage() {
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

  const homepage = useHomeNews()
  const { carousel, feed } = homepage
  const filtered = useSearchResults(activeFilters)

  const businessQuery = useArticles(
    { category: 'business' },
    { enabled: !isFiltering },
  )
  const sportQuery = useArticles(
    { category: 'sports' },
    { enabled: !isFiltering },
  )

  const business = (businessQuery.data ?? []).slice(0, 2)
  const sport = (sportQuery.data ?? []).slice(0, 2)

  const curatedView = useMemo(() => {
    const articles = filtered.data ?? []
    const byCategory = (needle: string) =>
      articles
        .filter((article) => article.category?.toLowerCase().includes(needle))
        .slice(0, 2)

    return {
      carousel: articles.slice(0, 3),
      feed: articles.slice(3),
      business: byCategory('business'),
      sport: byCategory('sport'),
    }
  }, [filtered.data])

  // Reflects whatever's currently on screen, so picking a source (or any
  // other filter) narrows the author options to match instead of always
  // listing authors from the unfiltered homepage feed.
  const availableAuthors = useMemo(() => {
    let source = feed
    if (isFiltering) source = filtered.data ?? []
    // Always keep already-selected authors in the list, even if they've
    // dropped out of the current results — otherwise there'd be no chip
    // left to click to deselect them.
    const seen = new Set<string>(authors)
    for (const article of source) {
      if (article.author) seen.add(article.author)
      if (seen.size >= AUTHOR_OPTIONS_LIMIT) break
    }
    return [...seen]
  }, [isFiltering, filtered.data, feed, authors])

  const persistPicks = (
    key: 'sources' | 'categories' | 'authors',
    next: string[],
  ) => {
    setFilterParams({ [key]: next })
    setPreferences((prev) => ({ ...prev, [key]: next }))
  }

  let isLoadingAuthors = homepage.isPending
  if (isFiltering) isLoadingAuthors = filtered.isPending

  let content: HomeContent
  if (isFiltering && !isCuratedOnly) {
    if (filtered.isPending) {
      content = { kind: 'search-pending' }
    } else {
      content = {
        kind: 'results',
        props: {
          articles: filtered.data,
          isError: filtered.isError,
          errorMessage: toErrorMessage(filtered.error),
        },
      }
    }
  } else if (isCuratedOnly) {
    if (filtered.isPending) {
      content = { kind: 'home-pending' }
    } else if (filtered.isError) {
      content = { kind: 'error', message: toErrorMessage(filtered.error) }
    } else {
      content = { kind: 'feed', props: curatedView }
    }
  } else if (homepage.isPending) {
    content = { kind: 'home-pending' }
  } else if (homepage.isError) {
    content = { kind: 'error', message: toErrorMessage(homepage.error) }
  } else {
    content = {
      kind: 'feed',
      props: {
        carousel,
        feed,
        business,
        sport,
        isLoadingCategories: businessQuery.isPending || sportQuery.isPending,
      },
    }
  }

  const filters: FilterBarProps = {
    authors: availableAuthors,
    isLoadingAuthors,
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

  return { filters, content }
}
