import { useMemo } from 'react'

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

import FilterBar from './components/FilterBar'
import FilteredResults from './components/FilteredResults'
import HomeFeed from './components/HomeFeed'
import HotNews from './components/HotNews'
import Alert from '@/components/Alert'
import { HeroCarouselSkeleton } from '@/components/site/HeroCarousel.skeleton'

import type { SelectedFilters } from '@/types/article'

import { useArticles } from '@/hooks/useArticles'
import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'

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

  // A source-only selection (no query/date/category/author) keeps the
  // familiar homepage layout — carousel, curated sections — instead of
  // dropping to the flat search-results grid.
  const isSourcesOnly =
    sources.length > 0 &&
    !activeFilters.query &&
    !activeFilters.from &&
    !activeFilters.to &&
    categories.length === 0 &&
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

  const sourcesOnlyView = useMemo(() => {
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

  const onToggleSource = (value: string) =>
    setFilterParams({ sources: toggle(sources, value) })
  const onToggleCategory = (value: string) =>
    setFilterParams({ categories: toggle(categories, value) })
  const onToggleAuthor = (value: string) =>
    setFilterParams({ authors: toggle(authors, value) })

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
        onClearSources={() => setFilterParams({ sources: [] })}
        onClearCategories={() => setFilterParams({ categories: [] })}
        onClearAuthors={() => setFilterParams({ authors: [] })}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={({ from, to }) => {
          setFilterParams({ from: from || null, to: to || null })
        }}
      />

      {isFiltering && !isSourcesOnly ? (
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
      ) : isSourcesOnly ? (
        filtered.isPending ? (
          <>
            <HotNews.Skeleton />
            <section>
              <HeroCarouselSkeleton />
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
            carousel={sourcesOnlyView.carousel}
            feed={sourcesOnlyView.feed}
            business={sourcesOnlyView.business}
            sport={sourcesOnlyView.sport}
          />
        )
      ) : homepage.isPending ? (
        <>
          <HotNews.Skeleton />
          <section>
            <HeroCarouselSkeleton />
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
