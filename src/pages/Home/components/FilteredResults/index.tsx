import Alert from '@/components/Alert'
import { VerticalCard } from '@/components/site/ArticleCard'
import { SectionHeader } from '@/components/site/SectionHeader'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'

type FilteredResultsProps = {
  articles: Article[] | undefined
  isLoading: boolean
  isError: boolean
  errorMessage: string
}

const FilteredResults = ({
  articles,
  isLoading,
  isError,
  errorMessage,
}: FilteredResultsProps) => {
  return (
    <section>
      <SectionHeader title="Results" />

      {isLoading && <Alert>Searching…</Alert>}

      {isError && <Alert>{errorMessage}</Alert>}

      {!isLoading && !isError && articles?.length === 0 && (
        <Alert>No articles matched these filters.</Alert>
      )}

      {!isLoading && !isError && articles && articles.length > 0 && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((article) => (
            <VerticalCard key={articleKey(article)} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FilteredResults
