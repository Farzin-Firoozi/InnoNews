import { getDefaultStore } from 'jotai'
import { describe, it, expect } from 'vitest'

import { preferencesAtom } from './preferences'

describe('preferences state', () => {
  it('initializes with default empty arrays', () => {
    const store = getDefaultStore()
    const prefs = store.get(preferencesAtom)
    expect(prefs).toEqual({
      sources: [],
      categories: [],
      authors: [],
    })
  })

  it('updates preferences in store and reflects changes', () => {
    const store = getDefaultStore()
    store.set(preferencesAtom, {
      sources: ['guardian'],
      categories: ['technology'],
      authors: ['Jane Doe'],
    })

    const updated = store.get(preferencesAtom)
    expect(updated).toEqual({
      sources: ['guardian'],
      categories: ['technology'],
      authors: ['Jane Doe'],
    })
  })
})
