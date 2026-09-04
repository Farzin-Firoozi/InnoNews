import Alert from '@/components/Alert'
import ArticleCard from '@/components/ArticleCard'

import type { FilteredResultsProps } from '@/types/home'

import { articleKey } from '../../utils'
import SectionHeader from '../SectionHeader'

const FilteredResults = ({
  articles,
  isError,
  errorMessage,
}: FilteredResultsProps) => {
  const isEmpty = !isError && (articles?.length ?? 0) === 0

  return (
    <section>
      <SectionHeader title="Results" />

      {isError && <Alert>{errorMessage}</Alert>}
      {isEmpty && <Alert>No articles matched these filters.</Alert>}

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {articles?.map((article) => (
          <ArticleCard.Vertical key={articleKey(article)} article={article} />
        ))}
      </div>
    </section>
  )
}

export default FilteredResults
