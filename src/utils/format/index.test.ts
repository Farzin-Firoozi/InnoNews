import { describe, it, expect } from 'vitest'

import type { Article } from '@/types/article'

import { tagLabel, sourceLabel, initials } from './index'

describe('format utils', () => {
  const mockArticle: Article = {
    id: 'test-id',
    source: 'guardian',
    title: 'Test Title',
    description: null,
    content: null,
    author: null,
    url: 'https://example.com',
    imageUrl: null,
    publishedAt: new Date().toISOString(),
    category: null,
  }

  describe('tagLabel', () => {
    it('returns capitalized category if present', () => {
      expect(tagLabel({ ...mockArticle, category: 'technology' })).toBe(
        'Technology',
      )
    })

    it('falls back to source label if category is missing', () => {
      expect(
        tagLabel({ ...mockArticle, category: null, source: 'guardian' }),
      ).toBe('The Guardian')
    })
  })

  describe('sourceLabel', () => {
    it('returns friendly source label for known sources', () => {
      expect(sourceLabel({ ...mockArticle, source: 'newsapi' })).toBe('NewsAPI')
      expect(sourceLabel({ ...mockArticle, source: 'guardian' })).toBe(
        'The Guardian',
      )
      expect(sourceLabel({ ...mockArticle, source: 'nytimes' })).toBe(
        'New York Times',
      )
      expect(sourceLabel({ ...mockArticle, source: 'bbc' })).toBe('BBC News')
    })
  })

  describe('initials', () => {
    it('returns ? for empty string', () => {
      expect(initials('')).toBe('?')
      expect(initials('   ')).toBe('?')
    })

    it('returns first 2 letters for single name', () => {
      expect(initials('Farzin')).toBe('FA')
    })

    it('returns first letters of first and last words for multi-word name', () => {
      expect(initials('John Doe')).toBe('JD')
      expect(initials('John Middle Doe')).toBe('JD')
    })
  })
})
