import { Link } from 'react-router-dom'

import SmartImage from '@/components/SmartImage'

import { cn } from '@/utils/cn'
import { articleHref } from '@/utils/links'

import type { Article } from '@/types/article'

import Meta from './Meta'

type ArticleCardOverlayProps = {
  article: Article
  className?: string
}

const ArticleCardOverlay = ({
  article,
  className,
}: ArticleCardOverlayProps) => {
  return (
    <Link
      to={articleHref(article)}
      className={cn(
        'group relative block overflow-hidden rounded-2xl',
        className,
      )}
    >
      <SmartImage
        src={article.imageUrl ?? undefined}
        alt={article.title}
        className="h-full w-full transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
        <Meta article={article} tone="onImage" />
        <h2 className="font-oranienbaum line-clamp-2 text-2xl leading-snug text-white sm:text-3xl md:text-4xl">
          {article.title}
        </h2>
        {article.description && (
          <p className="hidden max-w-xl text-sm leading-relaxed text-white/80 sm:line-clamp-2 md:block">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default ArticleCardOverlay
