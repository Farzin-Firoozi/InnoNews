import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAllArticles, searchArticles, fetchArticleById } from './articles'
import * as guardian from './sources/guardian'
import * as nytimes from './sources/nytimes'
import * as newsapi from './sources/newsapi'
import * as bbc from './sources/bbc'
import type { Article } from '../types/article'

vi.mock('./sources/guardian')
vi.mock('./sources/nytimes')
vi.mock('./sources/newsapi')
vi.mock('./sources/bbc')

const mockArticle = (
  id: string,
  source: 'guardian' | 'nytimes' | 'newsapi' | 'bbc',
  category: string | null = 'tech',
  author: string | null = 'Alice',
): Article => ({
  id,
  source,
  title: `Title ${id}`,
  description: `Description ${id}`,
  content: `Content ${id}`,
  author,
  url: `https://example.com/${id}`,
  imageUrl: null,
  publishedAt: '2025-01-01T10:00:00.000Z',
  category,
})

describe('Articles API Aggregator', () => {
  beforeEach(() => {
    vi.mocked(guardian.fetchArticles).mockResolvedValue([])
    vi.mocked(nytimes.fetchArticles).mockResolvedValue([])
    vi.mocked(newsapi.fetchArticles).mockResolvedValue([])
    vi.mocked(bbc.fetchArticles).mockResolvedValue([])
  })

  describe('fetchAllArticles', () => {
    it('aggregates articles across all sources sorted by date descending', async () => {
      vi.mocked(guardian.fetchArticles).mockResolvedValueOnce([
        { ...mockArticle('g1', 'guardian'), publishedAt: '2025-01-02T10:00:00Z' },
      ])
      vi.mocked(nytimes.fetchArticles).mockResolvedValueOnce([
        { ...mockArticle('ny1', 'nytimes'), publishedAt: '2025-01-03T10:00:00Z' },
      ])
      vi.mocked(newsapi.fetchArticles).mockResolvedValueOnce([
        { ...mockArticle('news1', 'newsapi'), publishedAt: '2025-01-01T10:00:00Z' },
      ])

      const articles = await fetchAllArticles({})
      expect(articles).toHaveLength(3)
      expect(articles[0].id).toBe('ny1')
      expect(articles[1].id).toBe('g1')
      expect(articles[2].id).toBe('news1')
    })
  })

  describe('searchArticles', () => {
    it('filters client-side when authors are specified', async () => {
      vi.mocked(guardian.fetchArticles).mockResolvedValue([
        mockArticle('1', 'guardian', 'technology', 'Alice'),
        mockArticle('2', 'guardian', 'technology', 'Bob'),
      ])

      const results = await searchArticles({
        categories: ['technology'],
        sources: ['guardian'],
        authors: ['Alice'],
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('1')
      expect(results[0].author).toBe('Alice')
    })
  })

  describe('fetchArticleById', () => {
    it('dispatches to correct source adapter', async () => {
      vi.mocked(guardian.fetchArticleById).mockResolvedValueOnce(mockArticle('g123', 'guardian'))

      const result = await fetchArticleById({ source: 'guardian', id: 'g123' })
      expect(guardian.fetchArticleById).toHaveBeenCalledWith('g123')
      expect(result?.id).toBe('g123')
    })

    it('returns null for unknown source', async () => {
      const result = await fetchArticleById({ source: 'unknown-source', id: '123' })
      expect(result).toBeNull()
    })
  })
})
