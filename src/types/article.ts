export type ArticleSource = 'newsapi' | 'guardian' | 'nytimes'

export type ArticleDetailParams = {
  source?: string
  id?: string
}

export interface Article {
  /** Source-specific raw id (url for NewsAPI, item path for Guardian, uri for NYT). */
  id: string
  source: ArticleSource
  title: string
  description: string | null
  /** Full body/content when the API exposes it, otherwise null. */
  content: string | null
  author: string | null
  /** Link to the original article on the publisher's site. */
  url: string
  imageUrl: string | null
  /** ISO 8601 date string. */
  publishedAt: string
  category: string | null
}

/** Shape sent to a single source adapter's `fetchArticles` — always at
 * most one category, since that's what a source's API call can take. */
export interface ArticleFilters {
  query?: string
  /** ISO date (YYYY-MM-DD) lower bound. */
  from?: string
  /** ISO date (YYYY-MM-DD) upper bound. */
  to?: string
  category?: string
  /** When set, only that source is queried. */
  source?: string
}

/** Shape of the user's current filter selection — multiple sources,
 * categories, and authors can be picked at once. No source API exposes a
 * real author filter, or a multi-category one, so those are matched
 * client-side against each fetched article after the network call(s). */
export interface SelectedFilters {
  query?: string
  from?: string
  to?: string
  categories: string[]
  sources: string[]
  authors: string[]
}

export const ARTICLE_SOURCES: ArticleSource[] = [
  'newsapi',
  'guardian',
  'nytimes',
]

export const SOURCE_LABELS: Record<ArticleSource, string> = {
  newsapi: 'NewsAPI',
  guardian: 'The Guardian',
  nytimes: 'New York Times',
}

export const ARTICLE_CATEGORIES = [
  'general',
  'business',
  'technology',
  'sports',
  'entertainment',
  'health',
  'science',
  'world',
  'politics',
  'environment',
  'culture',
  'money',
  'travel',
] as const
