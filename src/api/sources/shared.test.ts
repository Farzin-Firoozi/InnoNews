import { AxiosError, AxiosHeaders } from 'axios'
import { describe, it, expect } from 'vitest'

import {
  toFriendlyMessage,
  rethrowFriendly,
  requireKey,
  dateOnly,
  toIsoDate,
} from './shared'

describe('shared API utilities', () => {
  describe('toFriendlyMessage', () => {
    it('formats 401/403 auth errors', () => {
      const error = new AxiosError(
        'Request failed',
        '401',
        undefined,
        undefined,
        {
          status: 401,
          statusText: 'Unauthorized',
          data: {},
          headers: {},
          config: { headers: new AxiosHeaders() },
        },
      )
      expect(toFriendlyMessage(error, 'Test API')).toBe(
        'Test API: request rejected (missing or invalid API key).',
      )
    })

    it('formats 429 rate limit error', () => {
      const error = new AxiosError('Rate limit', '429', undefined, undefined, {
        status: 429,
        statusText: 'Too Many Requests',
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
      })
      expect(toFriendlyMessage(error, 'Test API')).toBe(
        'Test API: rate limit reached, try again later.',
      )
    })

    it('formats standard Error objects', () => {
      expect(toFriendlyMessage(new Error('Something failed'), 'Test API')).toBe(
        'Test API: Something failed',
      )
    })
  })

  describe('rethrowFriendly', () => {
    it('throws an error with the friendly message', () => {
      expect(() => {
        rethrowFriendly(new Error('Explosion'), 'Guardian')
      }).toThrowError('Guardian: Explosion')
    })
  })

  describe('requireKey', () => {
    it('returns key when present', () => {
      expect(requireKey('secret-key-123', 'VITE_KEY', 'Source')).toBe(
        'secret-key-123',
      )
    })

    it('throws if key is empty or undefined', () => {
      expect(() => requireKey(undefined, 'VITE_KEY', 'Source')).toThrowError(
        'Source: missing API key. Set VITE_KEY in your .env file.',
      )
    })
  })

  describe('dateOnly', () => {
    it('slices YYYY-MM-DD from ISO date string', () => {
      expect(dateOnly('2025-05-12T10:00:00Z')).toBe('2025-05-12')
    })

    it('returns undefined for empty input', () => {
      expect(dateOnly('')).toBeUndefined()
      expect(dateOnly(undefined)).toBeUndefined()
    })
  })

  describe('toIsoDate', () => {
    it('converts valid date string to ISO format', () => {
      const iso = toIsoDate('2025-01-01')
      expect(iso).toBe(new Date('2025-01-01').toISOString())
    })

    it('returns epoch ISO string for null/undefined/invalid date', () => {
      expect(toIsoDate(null)).toBe(new Date(0).toISOString())
      expect(toIsoDate('invalid-date')).toBe(new Date(0).toISOString())
    })
  })
})
