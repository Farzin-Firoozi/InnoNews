import { Link } from 'react-router'

import { Flame } from 'lucide-react'

import { articleHref } from '@/utils/links'

import type { Article } from '@/types/article'

type HotNewsProps = {
  articles: Article[]
}

const HotNewsComponent = ({ articles }: HotNewsProps) => {
  if (articles.length === 0) return null

  const headlines = (
    <>
      {articles.map((article) => (
        <Link
          to={articleHref(article)}
          key={`${article.source}:${article.id}`}
          className="hover:text-brand mx-4 inline-flex items-center gap-2 text-sm text-stone-700 transition"
        >
          {article.title}
          <span className="text-stone-200" aria-hidden="true">
            •
          </span>
        </Link>
      ))}
    </>
  )

  return (
    <div className="group/marquee flex items-center gap-3 overflow-hidden rounded-full border border-stone-200 bg-stone-50 py-2 pr-2 pl-4">
      <span className="text-brand flex shrink-0 items-center gap-1.5 text-xs font-medium tracking-[0.15em]">
        <Flame className="h-4 w-4" strokeWidth={1.75} />
        HOT
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {headlines}
          {headlines}
        </div>
      </div>
    </div>
  )
}

export default HotNewsComponent
