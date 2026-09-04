import { describe, it, expect } from 'vitest'

import type { Article } from '@/types/article'

import { articleKey, splitFeed, pickTopCreators } from './index'

describe('Home page utils', () => {
  const createArticle = (
    id: string,
    source: 'guardian' | 'newsapi' | 'nytimes' | 'bbc' = 'guardian',
    author: string | null = null,
  ): Article => ({
    id,
    source,
    title: `Title ${id}`,
    description: null,
    content: null,
    author,
    url: `https://example.com/${id}`,
    imageUrl: null,
    publishedAt: new Date().toISOString(),
    category: 'tech',
  })

  it('creates stable unique articleKey combining source and id', () => {
    const article = createArticle('123', 'guardian')
    expect(articleKey(article)).toBe('guardian:123')
  })

  it('splits feed correctly into latest, editorsPick, and marquee', () => {
    const feed = Array.from({ length: 15 }, (_, i) => createArticle(String(i)))
    const { latest, editorsPick, marquee } = splitFeed(feed)

    expect(latest).toHaveLength(4)
    expect(editorsPick).toHaveLength(5)
    expect(marquee).toHaveLength(10)
  })

  it('picks unique top creators up to the limit', () => {
    const feed: Article[] = [
      createArticle('1', 'guardian', 'Alice'),
      createArticle('2', 'guardian', 'Alice'),
      createArticle('3', 'guardian', 'Bob'),
      createArticle('4', 'guardian', null),
      createArticle('5', 'guardian', 'Charlie'),
      createArticle('6', 'guardian', 'David'),
      createArticle('7', 'guardian', 'Eve'),
    ]

    const creators = pickTopCreators(feed, 3)
    expect(creators).toHaveLength(3)
    expect(creators.map((a) => a.author)).toEqual(['Alice', 'Bob', 'Charlie'])
  })
})
