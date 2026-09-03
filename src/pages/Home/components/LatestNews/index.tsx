import { VerticalCard } from '@/components/site/ArticleCard'
import { SectionHeader } from '@/components/site/SectionHeader'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'

type LatestNewsProps = {
  articles: Article[]
}

const LatestNews = ({ articles }: LatestNewsProps) => {
  if (articles.length === 0) return null

  return (
    <section>
      <SectionHeader title="Latest News" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <VerticalCard key={articleKey(article)} article={article} />
        ))}
      </div>
    </section>
  )
}

export default LatestNews
