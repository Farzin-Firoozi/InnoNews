import { readTime, timeAgo } from '@/utils/date'
import { tagLabel } from '@/utils/format'

import type { Article } from '@/types/article'

type MetaProps = {
  article: Article
  tone?: 'default' | 'onImage'
}

const Meta = ({ article, tone = 'default' }: MetaProps) => {
  const toneClass = tone === 'onImage' ? 'text-white/75' : 'text-stone-500'

  return (
    <p className={`font-roboto text-xs ${toneClass}`}>
      <span className="font-medium text-brand">{tagLabel(article)}</span>
      {' · '}
      {timeAgo(article.publishedAt)}
      {' · '}
      {readTime(article)} min read
    </p>
  )
}

export default Meta
