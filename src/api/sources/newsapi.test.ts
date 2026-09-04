import { describe, it, expect, vi, beforeEach } from 'vitest'

import { client } from '../index'
import { fetchArticles, fetchArticleById } from './newsapi'

vi.mock('../index', () => ({
  client: {
    get: vi.fn(),
  },
}))

describe('NewsAPI source adapter', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_NEWS_API_KEY', 'test-newsapi-key')
  })

  it('fetches top-headlines when standard category is passed', async () => {
    const mockData = {
      data: {
        status: 'ok',
        articles: [
          {
            source: { id: null, name: 'CNN' },
            author: 'Jane Doe',
            title: 'Breaking Tech News',
            description: 'Description of tech news',
            url: 'https://cnn.com/tech-article',
            urlToImage: 'https://cnn.com/image.jpg',
            publishedAt: '2025-02-01T10:00:00Z',
            content: 'Article body',
          },
        ],
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)

    const results = await fetchArticles({ category: 'technology' })
    expect(client.get).toHaveBeenCalledWith(
      'https://newsapi.org/v2/top-headlines',
      expect.objectContaining({
        params: expect.objectContaining({ category: 'technology' }),
      }),
    )
    expect(results).toHaveLength(1)
    expect(results[0].source).toBe('newsapi')
    expect(results[0].id).toBe('https://cnn.com/tech-article')
  })

  it('returns null for fetchArticleById as expected for free tier', async () => {
    const result = await fetchArticleById()
    expect(result).toBeNull()
  })
})
