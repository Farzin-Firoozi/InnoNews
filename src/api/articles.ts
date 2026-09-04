import type {
  Article,
  ArticleFilters,
  ArticleSource,
  SelectedFilters,
} from '../types/article'
import { ARTICLE_SOURCES } from '../types/article'
import * as bbc from './sources/bbc'
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
  bbc,
}

function isKnownSource(value: string): value is ArticleSource {
  return (ARTICLE_SOURCES as string[]).includes(value)
}

function byPublishedAtDesc(a: Article, b: Article): number {
  return b.publishedAt.localeCompare(a.publishedAt)
}

/** Same article can come back from more than one request when categories are
 * fanned out, so results are keyed by source + source-specific id. */
function dedupe(articles: Article[]): Article[] {
  const seen = new Map<string, Article>()
  for (const article of articles) {
    const key = `${article.source}:${article.id}`
    if (!seen.has(key)) seen.set(key, article)
  }
  return [...seen.values()]
}

function firstRejectionError(
  settled: PromiseSettledResult<Article[]>[],
): Error | null {
  const rejection = settled.find((result) => result.status === 'rejected')
  if (!rejection) return null
  return rejection.reason instanceof Error
    ? rejection.reason
    : new Error(String(rejection.reason))
}

/**
 * Queries every source and merges the results. A failing source is skipped
 * rather than failing the whole request; if every source fails, the first
 * error is surfaced.
 */
export async function fetchAllArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const settled = await Promise.allSettled(
    ARTICLE_SOURCES.map((source) =>
      SOURCE_ADAPTERS[source].fetchArticles(filters),
    ),
  )

  const articles = settled.flatMap((result) =>
    result.status === 'fulfilled' ? result.value : [],
  )

  if (articles.length === 0) {
    const error = firstRejectionError(settled)
    if (error) throw error
  }

  return dedupe(articles).sort(byPublishedAtDesc)
}

/**
 * Search/filter path for multi-select sources/categories/authors. A source's
 * API call can only take one category, so each selected category is fetched
 * as its own request per source and the results are merged/deduped here.
 * Authors are still matched client-side, since no source API can filter by
 * one at all.
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
    filters.query ||
    (filters.authors.length === 1 ? filters.authors[0] : undefined)

  const categories: (string | undefined)[] = filters.categories.length
    ? filters.categories
    : [undefined]

  const requests = targets.flatMap((source) =>
    categories.map((category) => {
      const perSourceFilters: ArticleFilters = {
        query,
        from: filters.from,
        to: filters.to,
        category,
      }
      return SOURCE_ADAPTERS[source].fetchArticles(perSourceFilters)
    }),
  )

  const settled = await Promise.allSettled(requests)

  let articles = dedupe(
    settled.flatMap((result) =>
      result.status === 'fulfilled' ? result.value : [],
    ),
  )

  if (articles.length === 0) {
    const error = firstRejectionError(settled)
    if (error) throw error
  }

  if (filters.authors.length) {
    const needles = filters.authors.map((n) => n.toLowerCase())
    articles = articles.filter(
      (a) =>
        a.author && needles.some((n) => a.author!.toLowerCase().includes(n)),
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
