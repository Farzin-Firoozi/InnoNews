import { Link, useViewTransitionState } from 'react-router'

import SmartImage from '@/components/SmartImage'

import { cn } from '@/utils/cn'
import { articleHref, articleImageTransitionName } from '@/utils/links'

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
  const href = articleHref(article)
  const isTransitioning = useViewTransitionState(href)

  return (
    <Link
      to={href}
      viewTransition
      className={cn('group flex gap-3', className)}
    >
      <SmartImage
        src={article.imageUrl ?? undefined}
        alt={article.title}
        style={
          isTransitioning
            ? { viewTransitionName: articleImageTransitionName(article) }
            : undefined
        }
        className="h-20 w-24 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <h3 className="font-oranienbaum group-hover:text-brand line-clamp-2 text-sm leading-snug text-stone-900">
          {article.title}
        </h3>
        <Meta article={article} />
      </div>
    </Link>
  )
}

export default ArticleCardHorizontal
