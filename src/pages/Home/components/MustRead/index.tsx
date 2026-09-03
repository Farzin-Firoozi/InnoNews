import { HorizontalCard, VerticalCard } from '@/components/site/ArticleCard'
import { SectionHeader } from '@/components/site/SectionHeader'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'

type MustReadProps = {
  articles: Article[]
}

const MustRead = ({ articles }: MustReadProps) => {
  if (articles.length === 0) return null

  return (
    <section>
      <SectionHeader title="Must Read" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          {articles.slice(0, 2).map((article) => (
            <VerticalCard key={articleKey(article)} article={article} />
          ))}
        </div>

        {articles[2] && (
          <VerticalCard
            article={articles[2]}
            className="[&_h3]:text-lg [&_img]:aspect-[3/4] lg:[&_img]:h-full"
          />
        )}

        <div className="flex flex-col gap-5">
          {articles.slice(3, 8).map((article) => (
            <HorizontalCard key={articleKey(article)} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MustRead
