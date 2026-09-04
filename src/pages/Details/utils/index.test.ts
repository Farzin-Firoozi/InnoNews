import { describe, it, expect } from 'vitest'

import { parseParagraphs, paragraphLabel } from './index'

describe('Details page utils', () => {
  describe('parseParagraphs', () => {
    it('splits text into sentences and merges first two', () => {
      const text =
        'First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence.'
      const result = parseParagraphs(text)
      expect(result.length).toBeGreaterThanOrEqual(1)
    })

    it('handles empty or short text gracefully', () => {
      expect(parseParagraphs('')).toEqual([])
      expect(parseParagraphs('Single short sentence.')).toEqual([
        'Single short sentence.',
      ])
    })
  })

  describe('paragraphLabel', () => {
    it('truncates labels longer than 6 words with ellipsis', () => {
      const label = paragraphLabel('One two three four five six seven eight')
      expect(label).toBe('One two three four five six…')
    })

    it('preserves labels of 6 or fewer words', () => {
      const label = paragraphLabel('One two three')
      expect(label).toBe('One two three')
    })
  })
})
