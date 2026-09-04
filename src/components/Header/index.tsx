import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { Search, X } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useDebouncedValue } from 'rooks'

import BrandName from '@/components/BrandName'

const Header = () => {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ history: 'replace' }),
  )

  // Buffer typing locally so every keystroke doesn't touch the URL/router —
  // only the settled value is committed, and as a `replace` so it doesn't
  // spam a browser-history entry per character.
  const [inputValue, setInputValue] = useState(query)
  const [debouncedValue] = useDebouncedValue(inputValue, 400)

  useEffect(() => {
    setQuery(debouncedValue || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  // Stay in sync if the URL changes from elsewhere (browser back/forward, a
  // shared link, the clear button) — adjusted during render rather than in
  // an effect, per React's guidance for deriving state from a changed prop.
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setInputValue(query)
  }

  const clear = () => {
    setInputValue('')
    setQuery(null)
  }

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(inputValue || null)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="container flex items-center gap-4 py-4 sm:gap-6">
        <Link to="/" className="shrink-0">
          <BrandName />
        </Link>

        <form
          onSubmit={onSubmit}
          className="ml-auto flex min-w-0 flex-1 items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 sm:max-w-xs sm:px-4 sm:py-2"
        >
          <Search
            className="h-4 w-4 shrink-0 text-stone-500"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-500"
          />
          {inputValue ? (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-stone-700 transition hover:bg-white hover:text-brand"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </form>
      </div>
    </header>
  )
}

export default Header
