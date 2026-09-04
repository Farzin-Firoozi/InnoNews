import { Link } from 'react-router-dom'

import SmartImage from '@/components/SmartImage'

import { cn } from '@/utils/cn'
import { articleHref } from '@/utils/links'

import type { Article } from '@/types/article'

import Meta from './Meta'

type ArticleCardHorizontalProps = {
  article: Article
  className?: string
}

const ArticleCardHorizontal = ({
  article,
  className,
}: ArticleCardHorizontalProps) => {
  return (
    <Link
      to={articleHref(article)}
      className={cn('group flex gap-3', className)}
    >
      <SmartImage
        src={article.imageUrl ?? undefined}
        alt={article.title}
        className="h-20 w-24 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <h3 className="font-oranienbaum line-clamp-2 text-sm leading-snug text-stone-900 group-hover:text-brand">
          {article.title}
        </h3>
        <Meta article={article} />
      </div>
    </Link>
  )
}

export default ArticleCardHorizontal
