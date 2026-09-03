import { Link } from 'react-router'

import { Search, X } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'

import BrandName from '@/components/BrandName'

const Header = () => {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="container flex items-center gap-4 py-4 sm:gap-6">
        <Link to="/" className="shrink-0">
          <BrandName />
        </Link>

        <form
          onSubmit={onSubmit}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 sm:px-5 sm:py-3"
        >
          <Search
            className="h-5 w-5 shrink-0 text-stone-500 sm:h-6 sm:w-6"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value || null)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-500 sm:text-lg"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery(null)}
              aria-label="Clear search"
              className="rounded-full p-1 text-stone-700 transition hover:bg-white hover:text-red-600"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          ) : null}
        </form>
      </div>
    </header>
  )
}

export default Header
