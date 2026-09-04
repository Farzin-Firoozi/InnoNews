import type { Article, ArticleFilters } from '../../types/article'
import { client } from '../index'
import { dateOnly, requireKey, rethrowFriendly, toIsoDate } from './shared'

const LABEL = 'NewsAPI'
const BASE_URL = 'https://newsapi.org/v2'

/** Categories supported by /v2/top-headlines. */
const HEADLINE_CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
]

interface NewsApiArticle {
  source?: { id: string | null; name: string | null }
  author: string | null
  title: string | null
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string | null
  content: string | null
}

interface NewsApiResponse {
  status: string
  totalResults?: number
  articles?: NewsApiArticle[]
  message?: string
}

function mapArticle(raw: NewsApiArticle, category: string | null): Article {
  return {
    id: raw.url,
    source: 'newsapi',
    title: raw.title ?? 'Untitled',
    description: raw.description,
    content: raw.content,
    author: raw.author ?? raw.source?.name ?? null,
    url: raw.url,
    imageUrl: raw.urlToImage,
    publishedAt: toIsoDate(raw.publishedAt),
    category,
  }
}

export async function fetchArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const apiKey = requireKey(
    import.meta.env.VITE_NEWS_API_KEY,
    'VITE_NEWS_API_KEY',
    LABEL,
  )

  // /v2/everything supports keyword + date range but not category;
  // /v2/top-headlines supports category but not date range.
  const category = filters.category?.toLowerCase()
  const useHeadlines = Boolean(
    category && HEADLINE_CATEGORIES.includes(category),
  )

  const url = useHeadlines
    ? `${BASE_URL}/top-headlines`
    : `${BASE_URL}/everything`

  const params: Record<string, string | number> = {
    apiKey,
    pageSize: 20,
  }

  if (useHeadlines) {
    params.category = category as string
    params.language = 'en'
    if (filters.query) params.q = filters.query
  } else {
    // /v2/everything requires a q (or sources/domains) parameter.
    // /everything has no category param, so the category is folded into the
    // keyword query to keep the results at least topically relevant.
    params.q = [filters.query, category].filter(Boolean).join(' ') || 'news'
    params.language = 'en'
    params.sortBy = 'publishedAt'
    const from = dateOnly(filters.from)
    const to = dateOnly(filters.to)
    if (from) params.from = from
    if (to) params.to = to
  }

  try {
    const { data } = await client.get<NewsApiResponse>(url, { params })
    return (
      (data.articles ?? [])
        .filter((item) => Boolean(item.url))
        // Only /top-headlines actually constrains by category, so that's the
        // only branch whose results can be labelled with one.
        .map((item) =>
          mapArticle(item, useHeadlines ? (category ?? null) : null),
        )
    )
  } catch (error) {
    rethrowFriendly(error, LABEL)
  }
}

/**
 * NewsAPI has no single-article-by-id endpoint; the detail page falls back to
 * the cached list query.
 */
export async function fetchArticleById(): Promise<Article | null> {
  return null
}
