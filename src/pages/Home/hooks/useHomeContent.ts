import { useMemo } from 'react'

import type { Article, SelectedFilters } from '@/types/article'
import type { CategorySection, HomeContent } from '@/types/home'

import { useHomeNews } from '@/hooks/useHomeNews'
import { useSearchResults } from '@/hooks/useSearchResults'

const LOAD_ERROR = 'Failed to load articles.'

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return LOAD_ERROR
}

const CATEGORY_COLUMNS = 2
const ARTICLES_PER_COLUMN = 2

/** The category columns are sliced out of the articles already fetched for
 * the feed rather than fetched again — no source API call is needed just to
 * fill a couple of slots. Which categories show up is driven entirely by
 * what's actually present in that data, picking whichever categories have
 * the most articles instead of a fixed pair. */
function topCategorySections(articles: Article[]): CategorySection[] {
  const byCategory = new Map<string, Article[]>()

  for (const article of articles) {
    const category = article.category?.trim().toLowerCase()
    if (!category) continue
    const bucket = byCategory.get(category) ?? []
    bucket.push(article)
    byCategory.set(category, bucket)
  }

  return Array.from(byCategory.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, CATEGORY_COLUMNS)
    .map(([category, categoryArticles]) => ({
      key: category,
      title: category.replace(/\b\w/g, (char) => char.toUpperCase()),
      articles: categoryArticles.slice(0, ARTICLES_PER_COLUMN),
    }))
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

  // Category columns are a curated shortcut for browsing by category — once
  // the user has already picked one, showing them again is redundant.
  const showCategorySections = activeFilters.categories.length === 0

  const curatedView = useMemo(() => {
    const articles = filtered.data ?? []
    return {
      carousel: articles.slice(0, 3),
      feed: articles.slice(3),
      categorySections: showCategorySections
        ? topCategorySections(articles)
        : [],
    }
  }, [filtered.data, showCategorySections])

  const homeView = useMemo(
    () => ({
      carousel,
      feed,
      categorySections: topCategorySections(feed),
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
