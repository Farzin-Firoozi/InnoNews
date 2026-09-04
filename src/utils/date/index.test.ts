import { describe, it, expect } from 'vitest'

import type { Article } from '@/types/article'

import { formatDate, timeAgo, readTime } from './index'

describe('date utils', () => {
  describe('formatDate', () => {
    it('returns formatted string for valid ISO date', () => {
      const result = formatDate('2025-01-15T12:00:00Z')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('')
    })
  })

  describe('timeAgo', () => {
    it('returns empty string for invalid date', () => {
      expect(timeAgo('invalid-date')).toBe('')
    })

    it('returns "just now" for less than 1 minute ago', () => {
      const now = new Date().toISOString()
      expect(timeAgo(now)).toBe('just now')
    })

    it('returns minutes ago for timestamps within an hour', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
      expect(timeAgo(tenMinutesAgo)).toBe('10 minutes ago')
    })

    it('returns hours ago for timestamps within 24 hours', () => {
      const twoHoursAgo = new Date(
        Date.now() - 2 * 60 * 60 * 1000,
      ).toISOString()
      expect(timeAgo(twoHoursAgo)).toBe('2 hours ago')
    })

    it('returns days ago for timestamps within 7 days', () => {
      const threeDaysAgo = new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString()
      expect(timeAgo(threeDaysAgo)).toBe('3 days ago')
    })

    it('returns formatted date for older timestamps', () => {
      const tenDaysAgo = new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString()
      const formatted = timeAgo(tenDaysAgo)
      expect(formatted).not.toContain('ago')
      expect(formatted).toBeTruthy()
    })
  })

  describe('readTime', () => {
    it('calculates read time based on word count with a minimum of 1 min', () => {
      const mockArticle = {
        id: '1',
        source: 'guardian',
        title: 'Short title',
        description: 'Short description',
        content: null,
        author: 'Author',
        url: 'https://example.com',
        imageUrl: null,
        publishedAt: new Date().toISOString(),
        category: 'tech',
      } as Article

      expect(readTime(mockArticle)).toBe(1)
    })

    it('calculates higher read time for longer articles', () => {
      const words = Array.from({ length: 600 }, (_, i) => `word${i}`).join(' ')
      const mockArticle = {
        id: '1',
        source: 'guardian',
        title: 'Title',
        description: 'Description',
        content: words,
        author: 'Author',
        url: 'https://example.com',
        imageUrl: null,
        publishedAt: new Date().toISOString(),
        category: 'tech',
      } as Article

      expect(readTime(mockArticle)).toBe(3)
    })
  })
})
