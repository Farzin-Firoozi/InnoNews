import { useEffect, useMemo, useRef } from 'react'

import { useAtom } from 'jotai'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import FilterBar from './components/FilterBar'
import FilteredResults from './components/FilteredResults'
import HeroCarousel from './components/HeroCarousel'
import HomeFeed from './components/HomeFeed'
import HotNews from './components/HotNews'
import Alert from '@/components/Alert'

import type { SelectedFilters } from '@/types/article'

import { useArticles } from '@/hooks/useArticles'
import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'
import { preferencesAtom } from '@/state/preferences'

const AUTHOR_OPTIONS_LIMIT = 12

const HomePage = () => {
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
        .filter((a) => a.category?.toLowerCase().includes(needle))
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
    const source = isFiltering ? (filtered.data ?? []) : feed
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

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const onToggleSource = (value: string) => {
    const next = toggle(sources, value)
    setFilterParams({ sources: next })
    setPreferences((prev) => ({ ...prev, sources: next }))
  }
  const onToggleCategory = (value: string) => {
    const next = toggle(categories, value)
    setFilterParams({ categories: next })
    setPreferences((prev) => ({ ...prev, categories: next }))
  }
  const onToggleAuthor = (value: string) => {
    const next = toggle(authors, value)
    setFilterParams({ authors: next })
    setPreferences((prev) => ({ ...prev, authors: next }))
  }

  const onClearSources = () => {
    setFilterParams({ sources: [] })
    setPreferences((prev) => ({ ...prev, sources: [] }))
  }
  const onClearCategories = () => {
    setFilterParams({ categories: [] })
    setPreferences((prev) => ({ ...prev, categories: [] }))
  }
  const onClearAuthors = () => {
    setFilterParams({ authors: [] })
    setPreferences((prev) => ({ ...prev, authors: [] }))
  }

  return (
    <main className="container flex flex-col gap-10">
      <FilterBar
        authors={availableAuthors}
        isLoadingAuthors={isFiltering ? filtered.isPending : homepage.isPending}
        selectedSources={sources}
        selectedCategories={categories}
        selectedAuthors={authors}
        onToggleSource={onToggleSource}
        onToggleCategory={onToggleCategory}
        onToggleAuthor={onToggleAuthor}
        onClearSources={onClearSources}
        onClearCategories={onClearCategories}
        onClearAuthors={onClearAuthors}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={({ from, to }) => {
          setFilterParams({ from: from || null, to: to || null })
        }}
      />

      {isFiltering && !isCuratedOnly ? (
        <FilteredResults
          articles={filtered.data}
          isLoading={filtered.isPending}
          isError={filtered.isError}
          errorMessage={
            filtered.error instanceof Error
              ? filtered.error.message
              : 'Failed to load articles.'
          }
        />
      ) : isCuratedOnly ? (
        filtered.isPending ? (
          <>
            <HotNews.Skeleton />
            <section>
              <HeroCarousel.Skeleton />
            </section>
          </>
        ) : filtered.isError ? (
          <Alert>
            {filtered.error instanceof Error
              ? filtered.error.message
              : 'Failed to load articles.'}
          </Alert>
        ) : (
          <HomeFeed
            carousel={curatedView.carousel}
            feed={curatedView.feed}
            business={curatedView.business}
            sport={curatedView.sport}
          />
        )
      ) : homepage.isPending ? (
        <>
          <HotNews.Skeleton />
          <section>
            <HeroCarousel.Skeleton />
          </section>
        </>
      ) : homepage.isError ? (
        <Alert>
          {homepage.error instanceof Error
            ? homepage.error.message
            : 'Failed to load articles.'}
        </Alert>
      ) : (
        <HomeFeed
          carousel={carousel}
          feed={feed}
          business={business}
          sport={sport}
        />
      )}
    </main>
  )
}

export default HomePage
