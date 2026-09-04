import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import * as articlesApi from '../api/articles'
import type { Article } from '../types/article'
import { useArticle } from './useArticle'

vi.mock('../api/articles')

const sampleArticle: Article = {
  id: 'news-url-123',
  source: 'newsapi',
  title: 'NewsAPI Article',
  description: 'Desc',
  content: 'Content',
  author: 'Reporter',
  url: 'https://example.com/news-url-123',
  imageUrl: null,
  publishedAt: '2025-01-01T00:00:00Z',
  category: 'general',
}

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useArticle hook', () => {
  it('fetches article directly when available via fetchArticleById', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    vi.mocked(articlesApi.fetchArticleById).mockResolvedValueOnce(sampleArticle)

    const { result } = renderHook(
      () => useArticle({ source: 'newsapi', id: 'news-url-123' }),
      { wrapper: createWrapper(queryClient) },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(sampleArticle)
  })

  it('falls back to search-articles cache when direct lookup returns null', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    // Pre-populate search-articles cache
    queryClient.setQueryData(
      ['search-articles', { query: 'test' }],
      [sampleArticle],
    )

    // Mock direct fetch returning null (like NewsAPI)
    vi.mocked(articlesApi.fetchArticleById).mockResolvedValueOnce(null)

    const { result } = renderHook(
      () => useArticle({ source: 'newsapi', id: 'news-url-123' }),
      { wrapper: createWrapper(queryClient) },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(sampleArticle)
  })
})
