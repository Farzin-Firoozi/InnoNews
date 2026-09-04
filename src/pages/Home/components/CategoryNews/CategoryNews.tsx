import Alert from '@/components/Alert'
import ArticleCard from '@/components/ArticleCard'

import type { CategorySection } from '@/types/home'

import { articleKey } from '../../utils'
import SectionHeader from '../SectionHeader'
import CategoryNewsSkeleton from './CategoryNews.skeleton'

type CategoryNewsProps = {
  sections: CategorySection[]
  isLoading?: boolean
}

const CategoryColumn = ({ title, articles }: CategorySection) => {
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
        <Alert>No {title.toLowerCase()} stories in the current results.</Alert>
      )}
    </div>
  )
}

const CategoryNews = ({ sections, isLoading = false }: CategoryNewsProps) => {
  if (isLoading) return <CategoryNewsSkeleton />
  if (sections.length === 0) return null

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {sections.map((section) => (
        <CategoryColumn key={section.key} title={section.title} articles={section.articles} />
      ))}
    </section>
  )
}

export default CategoryNews
