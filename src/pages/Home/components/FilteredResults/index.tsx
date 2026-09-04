import Alert from '@/components/Alert'
import ArticleCard from '@/components/ArticleCard'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'
import SectionHeader from '../SectionHeader'

const SKELETON_COUNT = 8

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

      {isError && <Alert>{errorMessage}</Alert>}

      {!isLoading && !isError && articles?.length === 0 && (
        <Alert>No articles matched these filters.</Alert>
      )}

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ArticleCard.Vertical.Skeleton key={i} />
            ))
          : articles?.map((article) => (
              <ArticleCard.Vertical
                key={articleKey(article)}
                article={article}
              />
            ))}
      </div>
    </section>
  )
}

export default FilteredResults
