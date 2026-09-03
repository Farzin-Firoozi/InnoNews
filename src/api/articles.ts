import type {
  Article,
  ArticleFilters,
  ArticleSource,
  SelectedFilters,
} from '../types/article'
import { ARTICLE_SOURCES } from '../types/article'
import * as guardian from './sources/guardian'
import * as newsapi from './sources/newsapi'
import * as nytimes from './sources/nytimes'

interface SourceAdapter {
  fetchArticles: (filters: ArticleFilters) => Promise<Article[]>
  fetchArticleById: (id: string) => Promise<Article | null>
}

export const SOURCE_ADAPTERS: Record<ArticleSource, SourceAdapter> = {
  newsapi,
  guardian,
  nytimes,
}

function isKnownSource(value: string): value is ArticleSource {
  return (ARTICLE_SOURCES as string[]).includes(value)
}

function byPublishedAtDesc(a: Article, b: Article): number {
  return b.publishedAt.localeCompare(a.publishedAt)
}

/**
 * Queries every source (or only the selected one) and merges the results.
 * A failing source is skipped rather than failing the whole request; if every
 * source fails, the first error is surfaced.
 */
export async function fetchAllArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const targets =
    filters.source && isKnownSource(filters.source)
      ? [filters.source]
      : ARTICLE_SOURCES

  const settled = await Promise.allSettled(
    targets.map((source) => SOURCE_ADAPTERS[source].fetchArticles(filters)),
  )

  const articles = settled.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  )

  if (articles.length === 0) {
    const firstRejection = settled.find((r) => r.status === 'rejected')
    if (firstRejection) {
      throw firstRejection.reason instanceof Error
        ? firstRejection.reason
        : new Error(String(firstRejection.reason))
    }
  }

  return articles.sort(byPublishedAtDesc)
}

/**
 * Search/filter path for multi-select sources/categories/authors. A source's
 * API call can only take one category, so when exactly one is selected it's
 * passed through server-side; zero or multiple categories fall back to an
 * unfiltered fetch with client-side matching below (same for authors, which
 * no source API can filter by at all).
 */
export async function searchArticles(
  filters: SelectedFilters,
): Promise<Article[]> {
  const targets = filters.sources.length
    ? filters.sources.filter(isKnownSource)
    : ARTICLE_SOURCES

  // Give the single-author case a query boost so the server-side search
  // returns relevant results too, not just whatever the client filter keeps.
  const query =
    filters.query || (filters.authors.length === 1 ? filters.authors[0] : undefined)

  const perSourceFilters: ArticleFilters = {
    query,
    from: filters.from,
    to: filters.to,
    category: filters.categories.length === 1 ? filters.categories[0] : undefined,
  }

  const settled = await Promise.allSettled(
    targets.map((source) => SOURCE_ADAPTERS[source].fetchArticles(perSourceFilters)),
  )

  let articles = settled.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  )

  if (articles.length === 0) {
    const firstRejection = settled.find((r) => r.status === 'rejected')
    if (firstRejection) {
      throw firstRejection.reason instanceof Error
        ? firstRejection.reason
        : new Error(String(firstRejection.reason))
    }
  }

  if (filters.categories.length > 1) {
    const needles = filters.categories.map((c) => c.toLowerCase())
    articles = articles.filter(
      (a) => a.category && needles.some((n) => a.category!.toLowerCase().includes(n)),
    )
  }

  if (filters.authors.length) {
    const needles = filters.authors.map((n) => n.toLowerCase())
    articles = articles.filter(
      (a) => a.author && needles.some((n) => a.author!.toLowerCase().includes(n)),
    )
  }

  return articles.sort(byPublishedAtDesc)
}

export async function fetchArticleById(params: {
  source: string
  id: string
}): Promise<Article | null> {
  const { source, id } = params

  if (!isKnownSource(source)) return null
  return SOURCE_ADAPTERS[source].fetchArticleById(id)
}
