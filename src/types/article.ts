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
] as const
