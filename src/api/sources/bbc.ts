import type { Article, ArticleFilters } from '../../types/article'
import { client } from '../index'
import { requireKey, rethrowFriendly, toIsoDate } from './shared'

const LABEL = 'BBC News'
const BASE_URL = 'https://newsdata.io/api/1/latest'
const DOMAIN = 'bbc'

interface NewsDataArticle {
  article_id: string
  link: string
  title: string | null
  description: string | null
  content: string | null
  creator?: string[] | null
  image_url: string | null
  pubDate: string | null
  category?: string[] | null
}

interface NewsDataResponse {
  status: string
  results?: NewsDataArticle[]
}

/** Free plan returns this literal placeholder instead of real body text. */
function realContent(value: string | null): string | null {
  return value && !value.startsWith('ONLY AVAILABLE IN') ? value : null
}

/** newsdata.io tags most articles with a generic "top" alongside the real
 * category (e.g. ["top", "technology"]) — skip "top" when a more specific
 * one is present. */
function resolveCategory(values?: string[] | null): string | null {
  if (!values?.length) return null
  return values.find((value) => value !== 'top') ?? values[0]
}

function mapArticle(raw: NewsDataArticle): Article {
  return {
    id: raw.article_id,
    source: 'bbc',
    title: raw.title ?? 'Untitled',
    description: raw.description,
    content: realContent(raw.content),
    author: raw.creator?.[0] ?? null,
    url: raw.link,
    imageUrl: raw.image_url,
    publishedAt: toIsoDate(raw.pubDate),
    category: resolveCategory(raw.category),
  }
}

function getApiKey(): string {
  return requireKey(
    import.meta.env.VITE_NEWSDATA_API_KEY,
    'VITE_NEWSDATA_API_KEY',
    LABEL,
  )
}

/**
 * BBC has no public API of its own; this reuses newsdata.io's BBC feed
 * (domain=bbc). The free plan only exposes /latest (last 48h, no
 * from_date/to_date — those require the paid Archive endpoint), so date
 * range filters are not applied here.
 */
export async function fetchArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const params: Record<string, string | number> = {
    apikey: getApiKey(),
    domain: DOMAIN,
  }

  if (filters.query) params.q = filters.query
  if (filters.category) params.category = filters.category.toLowerCase()

  try {
    const { data } = await client.get<NewsDataResponse>(BASE_URL, { params })
    return (data.results ?? [])
      .filter((item) => Boolean(item.link))
      .map(mapArticle)
  } catch (error) {
    rethrowFriendly(error, LABEL)
  }
}

/** newsdata.io supports filtering /latest by its own article_id, which is
 * the same value we store as an article's `id` — a real by-id lookup. */
export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const { data } = await client.get<NewsDataResponse>(BASE_URL, {
      params: { apikey: getApiKey(), id },
    })
    const article = data.results?.[0]
    return article ? mapArticle(article) : null
  } catch {
    // Let the caller fall back to the cached list result.
    return null
  }
}
