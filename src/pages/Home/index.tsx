import { useMemo } from 'react'

import { parseAsString, useQueryStates } from 'nuqs'
import { useDebouncedValue } from 'rooks'

import FilterBar, { type PillFilter } from './components/FilterBar'
import FilteredResults from './components/FilteredResults'
import HomeFeed from './components/HomeFeed'
import HotNews from './components/HotNews'
import StatusMessage from './components/StatusMessage'

import type { ArticleFilters } from '@/types/article'

import { useArticles } from '@/hooks/useArticles'
import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'

const HomePage = () => {
  const [filterParams, setFilterParams] = useQueryStates({
    q: parseAsString.withDefault(''),
    from: parseAsString.withDefault(''),
    to: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    source: parseAsString.withDefault(''),
  })

  const {
    q: query,
    from: dateFrom,
    to: dateTo,
    category,
    source,
  } = filterParams

  const activePill: PillFilter | null = category
    ? { type: 'category', value: category }
    : source
      ? { type: 'source', value: source }
      : null

  const [debouncedQuery] = useDebouncedValue(query, 400)

  const activeFilters: ArticleFilters = useMemo(() => {
    const filters: ArticleFilters = {}
    if (debouncedQuery.trim()) filters.query = debouncedQuery.trim()
    if (dateFrom) filters.from = dateFrom
    if (dateTo) filters.to = dateTo
    if (category) filters.category = category
    if (source) filters.source = source
    return filters
  }, [debouncedQuery, dateFrom, dateTo, category, source])

  const isFiltering = Object.keys(activeFilters).length > 0

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

  const onPillSelect = (pill: PillFilter) => {
    const isSame =
      activePill?.type === pill.type && activePill.value === pill.value
    if (isSame) {
      setFilterParams({ category: null, source: null })
      return
    }
    setFilterParams(
      pill.type === 'category'
        ? { category: pill.value, source: null }
        : { category: null, source: pill.value },
    )
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-8 sm:px-6 sm:py-10">
      <FilterBar
        active={activePill}
        onSelect={onPillSelect}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={({ from, to }) => {
          setFilterParams({ from: from || null, to: to || null })
        }}
      />

      {isFiltering ? (
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
      ) : homepage.isPending ? (
        <HotNews.Skeleton />
      ) : homepage.isError ? (
        <StatusMessage tone="brand" role="alert">
          {homepage.error instanceof Error
            ? homepage.error.message
            : 'Failed to load articles.'}
        </StatusMessage>
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
