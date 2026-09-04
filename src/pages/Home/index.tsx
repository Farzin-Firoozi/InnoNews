import FilterBar from './components/FilterBar'
import FilteredResults from './components/FilteredResults'
import HomeFeed from './components/HomeFeed'
import Alert from '@/components/Alert'

import type { HomeContent } from '@/types/home'

import { useHomePage } from './hooks/useHomePage'

const HomeContentView = ({ content }: { content: HomeContent }) => {
  switch (content.kind) {
    case 'results':
      return <FilteredResults {...content.props} />
    case 'search-pending':
      return <FilteredResults.Skeleton />
    case 'home-pending':
      return <HomeFeed.Skeleton />
    case 'error':
      return <Alert>{content.message}</Alert>
    case 'feed':
      return <HomeFeed {...content.props} />
  }
}

const HomePage = () => {
  const { filters, content } = useHomePage()

  return (
    <main className="container flex flex-col gap-10">
      <FilterBar filters={filters} />
      <HomeContentView content={content} />
    </main>
  )
}

export default HomePage
