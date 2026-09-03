import type { Article, ArticleFilters, ArticleSource } from '../types/article'
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

export async function fetchArticleById(params: {
  source: string
  id: string
}): Promise<Article | null> {
  const { source, id } = params

  if (!isKnownSource(source)) return null
  return SOURCE_ADAPTERS[source].fetchArticleById(id)
}
