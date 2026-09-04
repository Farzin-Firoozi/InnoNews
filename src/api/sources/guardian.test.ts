import { describe, it, expect, vi, beforeEach } from 'vitest'

import { client } from '../index'
import { fetchArticles, fetchArticleById } from './guardian'

vi.mock('../index', () => ({
  client: {
    get: vi.fn(),
  },
}))

describe('Guardian API source adapter', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GUARDIAN_API_KEY', 'test-guardian-key')
  })

  it('fetches and maps articles properly', async () => {
    const mockData = {
      data: {
        response: {
          status: 'ok',
          results: [
            {
              id: 'world/2025/jan/01/sample-article',
              webTitle: 'Sample Title',
              webUrl:
                'https://theguardian.com/world/2025/jan/01/sample-article',
              webPublicationDate: '2025-01-01T12:00:00Z',
              sectionName: 'World news',
              fields: {
                headline: 'Custom Headline',
                trailText: '<p>Short summary</p>',
                body: '<p>Full body paragraph</p>',
                byline: 'Reporter Name',
                thumbnail: 'https://theguardian.com/thumb.jpg',
              },
            },
          ],
        },
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)

    const results = await fetchArticles({ query: 'tech' })
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: 'world/2025/jan/01/sample-article',
      source: 'guardian',
      title: 'Custom Headline',
      description: 'Short summary',
      content: 'Full body paragraph',
      author: 'Reporter Name',
      url: 'https://theguardian.com/world/2025/jan/01/sample-article',
      imageUrl: 'https://theguardian.com/thumb.jpg',
      publishedAt: '2025-01-01T12:00:00.000Z',
      category: 'World news',
    })
  })

  it('fetches single article by ID', async () => {
    const mockData = {
      data: {
        response: {
          status: 'ok',
          content: {
            id: 'item/123',
            webTitle: 'Single Title',
            webUrl: 'https://theguardian.com/item/123',
            webPublicationDate: '2025-01-01T12:00:00Z',
            fields: {
              headline: 'Single Headline',
            },
          },
        },
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)

    const article = await fetchArticleById('item/123')
    expect(article).not.toBeNull()
    expect(article?.id).toBe('item/123')
    expect(article?.title).toBe('Single Headline')
  })

  it('returns null on fetchArticleById failure', async () => {
    vi.mocked(client.get).mockRejectedValueOnce(new Error('Network error'))
    const article = await fetchArticleById('item/123')
    expect(article).toBeNull()
  })
})
