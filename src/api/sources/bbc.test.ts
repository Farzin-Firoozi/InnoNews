import { describe, it, expect, vi, beforeEach } from 'vitest'

import { client } from '../index'
import { fetchArticles, fetchArticleById } from './bbc'

vi.mock('../index', () => ({
  client: {
    get: vi.fn(),
  },
}))

describe('BBC source adapter (via newsdata.io)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_NEWSDATA_API_KEY', 'test-newsdata-key')
  })

  it('fetches and maps BBC articles properly', async () => {
    const mockData = {
      data: {
        status: 'success',
        results: [
          {
            article_id: 'bbc_123',
            link: 'https://bbc.com/news/123',
            title: 'BBC Headline',
            description: 'BBC summary',
            content: 'Full BBC content text',
            creator: ['BBC Journalist'],
            image_url: 'https://bbc.com/img.png',
            pubDate: '2025-01-03 14:00:00',
            category: ['top', 'world'],
          },
        ],
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)

    const results = await fetchArticles({})
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: 'bbc_123',
      source: 'bbc',
      title: 'BBC Headline',
      description: 'BBC summary',
      content: 'Full BBC content text',
      author: 'BBC Journalist',
      url: 'https://bbc.com/news/123',
      imageUrl: 'https://bbc.com/img.png',
      publishedAt: new Date('2025-01-03 14:00:00').toISOString(),
      category: 'world',
    })
  })

  it('fetches article by ID', async () => {
    const mockData = {
      data: {
        status: 'success',
        results: [
          {
            article_id: 'bbc_single',
            link: 'https://bbc.com/single',
            title: 'Single BBC',
            pubDate: '2025-01-01',
          },
        ],
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)
    const article = await fetchArticleById('bbc_single')
    expect(article).not.toBeNull()
    expect(article?.id).toBe('bbc_single')
  })
})
