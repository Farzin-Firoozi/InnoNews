import type { Article } from './article'

export type FilterBarProps = {
  authors: string[]
  isLoadingAuthors: boolean
  selectedSources: string[]
  selectedCategories: string[]
  selectedAuthors: string[]
  onToggleSource: (value: string) => void
  onToggleCategory: (value: string) => void
  onToggleAuthor: (value: string) => void
  onClearSources: () => void
  onClearCategories: () => void
  onClearAuthors: () => void
  dateFrom: string
  dateTo: string
  onDateChange: (patch: { from?: string; to?: string }) => void
}

export type HomeFeedProps = {
  carousel: Article[]
  feed: Article[]
  business: Article[]
  sport: Article[]
  isLoadingCategories?: boolean
}

export type FilteredResultsProps = {
  articles: Article[] | undefined
  isError: boolean
  errorMessage: string
}

export type HomeContent =
  | { kind: 'results'; props: FilteredResultsProps }
  | { kind: 'search-pending' }
  | { kind: 'home-pending' }
  | { kind: 'error'; message: string }
  | { kind: 'feed'; props: HomeFeedProps }
