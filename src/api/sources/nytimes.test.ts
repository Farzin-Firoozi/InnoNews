import { describe, it, expect, vi, beforeEach } from 'vitest'

import { client } from '../index'
import { fetchArticles, fetchArticleById } from './nytimes'

vi.mock('../index', () => ({
  client: {
    get: vi.fn(),
  },
}))

describe('NYTimes source adapter', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_NYT_API_KEY', 'test-nyt-key')
  })

  it('fetches and maps articles properly with image resolutions', async () => {
    const mockData = {
      data: {
        status: 'OK',
        response: {
          docs: [
            {
              _id: 'nyt://article/123',
              web_url: 'https://nytimes.com/article/123',
              abstract: 'Abstract text',
              lead_paragraph: 'Lead paragraph text',
              pub_date: '2025-01-02T10:00:00Z',
              section_name: 'Technology',
              headline: { main: 'NYT Tech Story' },
              byline: { original: 'By NYT Reporter' },
              multimedia: {
                default: { url: 'images/2025/01/02/article.jpg' },
              },
            },
          ],
        },
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)

    const results = await fetchArticles({ query: 'AI' })
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({
      id: 'nyt://article/123',
      source: 'nytimes',
      title: 'NYT Tech Story',
      description: 'Abstract text',
      content: 'Lead paragraph text',
      author: 'By NYT Reporter',
      url: 'https://nytimes.com/article/123',
      imageUrl: 'https://www.nytimes.com/images/2025/01/02/article.jpg',
      publishedAt: '2025-01-02T10:00:00.000Z',
      category: 'Technology',
    })
  })

  it('fetches article by ID using uri query', async () => {
    const mockData = {
      data: {
        status: 'OK',
        response: {
          docs: [
            {
              _id: 'nyt://article/999',
              web_url: 'https://nytimes.com/article/999',
              headline: { main: 'Found By ID' },
              pub_date: '2025-01-01T00:00:00Z',
            },
          ],
        },
      },
    }

    vi.mocked(client.get).mockResolvedValueOnce(mockData)
    const result = await fetchArticleById('nyt://article/999')
    expect(result).not.toBeNull()
    expect(result?.title).toBe('Found By ID')
  })
})
