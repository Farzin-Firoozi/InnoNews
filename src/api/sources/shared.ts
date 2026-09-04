import { AxiosError } from 'axios'

/** Turns any thrown value into a short, user-presentable message. */
export function toFriendlyMessage(error: unknown, sourceLabel: string): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return `${sourceLabel}: request rejected (missing or invalid API key).`
    }
    if (status === 429) {
      return `${sourceLabel}: rate limit reached, try again later.`
    }
    if (status) {
      return `${sourceLabel}: request failed with status ${status}.`
    }
    return `${sourceLabel}: network error — the request could not be completed.`
  }
  if (error instanceof Error) return `${sourceLabel}: ${error.message}`
  return `${sourceLabel}: unknown error.`
}

/** Throws a friendly Error so callers (and Promise.allSettled) get readable reasons. */
export function rethrowFriendly(error: unknown, sourceLabel: string): never {
  throw new Error(toFriendlyMessage(error, sourceLabel))
}

export function requireKey(
  value: string | undefined,
  envName: string,
  sourceLabel: string,
): string {
  if (!value) {
    throw new Error(
      `${sourceLabel}: missing API key. Set ${envName} in your .env file.`,
    )
  }
  return value
}

/** Normalizes a date-only filter (YYYY-MM-DD) or returns undefined. */
export function dateOnly(value?: string): string | undefined {
  return value && value.length > 0 ? value.slice(0, 10) : undefined
}

export function toIsoDate(value: string | null | undefined): string {
  if (!value) return new Date(0).toISOString()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? new Date(0).toISOString()
    : parsed.toISOString()
}
