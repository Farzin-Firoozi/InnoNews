import ArticleCard from '@/components/ArticleCard'

import type { Article } from '@/types/article'

import { articleKey } from '../../utils'
import SectionHeader from '../SectionHeader'

type EditorsPickProps = {
  articles: Article[]
}

const EditorsPick = ({ articles }: EditorsPickProps) => {
  if (articles.length === 0) return null

  return (
    <section>
      <SectionHeader title="Editor's Pick" />
      <div className="flex flex-col gap-5">
        {articles[0] && (
          <ArticleCard.Overlay article={articles[0]} className="h-72 sm:h-96" />
        )}
        {articles.length > 1 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
            {articles.slice(1).map((article) => (
              <ArticleCard.Vertical
                key={articleKey(article)}
                article={article}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EditorsPick
