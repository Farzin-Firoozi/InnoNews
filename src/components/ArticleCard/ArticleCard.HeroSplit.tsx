import { Link } from 'react-router-dom'

import SmartImage from '@/components/SmartImage'

import { cn } from '@/utils/cn'
import { articleHref } from '@/utils/links'

import type { Article } from '@/types/article'

import Meta from './Meta'

type ArticleCardHeroSplitProps = {
  article: Article
  className?: string
}

const ArticleCardHeroSplit = ({
  article,
  className,
}: ArticleCardHeroSplitProps) => {
  return (
    <Link
      to={articleHref(article)}
      className={cn(
        'group grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center',
        className,
      )}
    >
      <SmartImage
        src={article.imageUrl ?? undefined}
        alt={article.title}
        className="aspect-[4/3] w-full rounded-2xl transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex flex-col gap-3">
        <Meta article={article} />
        <h2 className="font-oranienbaum text-2xl leading-snug text-stone-900 sm:text-3xl md:text-4xl">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-stone-700">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default ArticleCardHeroSplit
