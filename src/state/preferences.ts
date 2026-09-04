import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { z } from 'zod'

/**
 * Personalized feed picks (sources/categories/authors) survive across
 * visits in localStorage. Query/date filters stay URL-only (`nuqs`) since
 * those are meant to be shareable/ephemeral, not "preferences".
 */
const PreferencesSchema = z.object({
  sources: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  authors: z.array(z.string()).default([]),
})

export type Preferences = z.infer<typeof PreferencesSchema>

const STORAGE_KEY = 'inno-news:preferences'

const defaultPreferences: Preferences = {
  sources: [],
  categories: [],
  authors: [],
}

/** localStorage is user-editable/foreign input — validate before trusting
 * it, and fall back to defaults on anything malformed rather than throwing. */
const baseStorage = createJSONStorage<Preferences>(() => localStorage)

const validatedStorage = {
  ...baseStorage,
  getItem: (key: string, initialValue: Preferences) => {
    const raw = baseStorage.getItem(key, initialValue)
    const parsed = PreferencesSchema.safeParse(raw)
    return parsed.success ? parsed.data : initialValue
  },
}

// `getOnInit: true` makes the atom's *first* render value come straight
// from localStorage, not the default — otherwise it only reads on mount
// (after first paint), which would race any effect that reads it once on
// initial mount (e.g. Home's URL-hydration-from-preferences effect).
export const preferencesAtom = atomWithStorage<Preferences>(
  STORAGE_KEY,
  defaultPreferences,
  validatedStorage,
  { getOnInit: true },
)
