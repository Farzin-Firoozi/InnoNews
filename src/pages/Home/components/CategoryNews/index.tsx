import Alert from '@/components/Alert'
import ArticleCard from '@/components/ArticleCard'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'
import SectionHeader from '../SectionHeader'

type CategoryNewsProps = {
  business: Article[]
  sport: Article[]
}

const CategoryColumn = ({
  title,
  articles,
  emptyLabel,
}: {
  title: string
  articles: Article[]
  emptyLabel: string
}) => {
  return (
    <div>
      <SectionHeader title={title} />
      {articles.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          {articles.map((article) => (
            <ArticleCard.Vertical key={articleKey(article)} article={article} />
          ))}
        </div>
      ) : (
        <Alert>{emptyLabel}</Alert>
      )}
    </div>
  )
}

const CategoryNews = ({ business, sport }: CategoryNewsProps) => {
  if (business.length === 0 && sport.length === 0) return null

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <CategoryColumn
        title="Business"
        articles={business}
        emptyLabel="No business stories in the current results."
      />
      <CategoryColumn
        title="Sport News"
        articles={sport}
        emptyLabel="No sport stories in the current results."
      />
    </section>
  )
}

export default CategoryNews
