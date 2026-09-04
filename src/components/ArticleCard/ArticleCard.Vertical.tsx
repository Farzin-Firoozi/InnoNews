import { Link } from 'react-router'

import SmartImage from '@/components/SmartImage'

import { cn } from '@/utils/cn'
import { articleHref } from '@/utils/links'

import type { Article } from '@/types/article'

import Meta from './Meta'

type ArticleCardVerticalProps = {
  article: Article
  className?: string
}

const ArticleCardVertical = ({
  article,
  className,
}: ArticleCardVerticalProps) => {
  return (
    <Link
      to={articleHref(article)}
      className={cn('group flex flex-col gap-3', className)}
    >
      <SmartImage
        src={article.imageUrl ?? undefined}
        alt={article.title}
        className="aspect-[4/3] w-full rounded-xl transition duration-500 group-hover:scale-[1.02]"
      />
      <Meta article={article} />
      <h3 className="font-oranienbaum group-hover:text-brand line-clamp-2 text-base leading-snug text-stone-900">
        {article.title}
      </h3>
    </Link>
  )
}

export default ArticleCardVertical
