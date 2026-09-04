import { describe, it, expect } from 'vitest'

import type { Article } from '@/types/article'

import { articleHref } from './index'

describe('links utils', () => {
  it('encodes article id properly in href', () => {
    const article: Article = {
      id: 'https://example.com/article?id=123&test=true',
      source: 'newsapi',
      title: 'Title',
      description: null,
      content: null,
      author: null,
      url: 'https://example.com',
      imageUrl: null,
      publishedAt: '2025-01-01T00:00:00Z',
      category: null,
    }

    const href = articleHref(article)
    expect(href).toBe(`/article/newsapi/${encodeURIComponent(article.id)}`)
  })
})
