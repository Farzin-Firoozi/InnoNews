import { useMemo } from 'react'

import type { Article, SelectedFilters } from '@/types/article'
import type { HomeContent } from '@/types/home'

import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'

const LOAD_ERROR = 'Failed to load articles.'

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return LOAD_ERROR
}

/** The Business/Sport columns are sliced out of the articles already fetched
 * for the feed rather than fetched again — no source API call is needed just
 * to fill two slots. */
function byCategory(articles: Article[], needle: string) {
  return articles
    .filter((article) => article.category?.toLowerCase().includes(needle))
    .slice(0, 2)
}

/**
 * Runs the two article queries (home feed, search results) and composes the
 * one of them that matches the current view mode into renderable content.
 */
export function useHomeContent(
  activeFilters: SelectedFilters,
  isFiltering: boolean,
  isCuratedOnly: boolean,
) {
  const homepage = useHomeNews()
  const { carousel, feed } = homepage
  const filtered = useSearchResults(activeFilters)

  const curatedView = useMemo(() => {
    const articles = filtered.data ?? []
    return {
      carousel: articles.slice(0, 3),
      feed: articles.slice(3),
      business: byCategory(articles, 'business'),
      sport: byCategory(articles, 'sport'),
    }
  }, [filtered.data])

  const homeView = useMemo(
    () => ({
      carousel,
      feed,
      business: byCategory(feed, 'business'),
      sport: byCategory(feed, 'sport'),
    }),
    [carousel, feed],
  )

  // The author options mirror whatever's on screen, so they're derived from
  // the same result set this hook decided to render.
  const authorArticles = useMemo(
    () => (isFiltering ? (filtered.data ?? []) : feed),
    [isFiltering, filtered.data, feed],
  )

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
    content = { kind: 'feed', props: homeView }
  }

  return {
    content,
    authorArticles,
    isLoadingAuthors: isFiltering ? filtered.isPending : homepage.isPending,
  }
}
