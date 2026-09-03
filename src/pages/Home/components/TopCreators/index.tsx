import { Link } from 'react-router'

import { SectionHeader } from '@/components/site/SectionHeader'
import { articleHref, initials, sourceLabel } from '@/components/site/format'

import type { Article } from '@/types/article'

type TopCreatorsProps = {
  articles: Article[]
}

const TopCreators = ({ articles }: TopCreatorsProps) => {
  if (articles.length === 0) return null

  return (
    <section>
      <SectionHeader title="Top Creator" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {articles.map((article) => (
          <Link
            key={article.author}
            to={articleHref(article)}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span className="font-oranienbaum flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-base text-white">
              {initials(article.author ?? '?')}
            </span>
            <span className="text-sm font-medium text-stone-900">
              {article.author}
            </span>
            <span className="text-xs text-blue-600">{sourceLabel(article)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TopCreators
