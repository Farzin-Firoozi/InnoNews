import { ArrowRightIcon } from 'lucide-react'

import SmartImage from '@/components/SmartImage'

import { readTime, timeAgo } from '@/utils/date'

import {
  SOURCE_LABELS,
  type Article,
  type ArticleSource,
} from '@/types/article'

import ArticleBody from '../ArticleBody'

type ArticleViewProps = {
  article: Article
}

const ArticleViewComponent = ({ article }: ArticleViewProps) => {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <h1 className="font-oranienbaum text-3xl leading-snug text-stone-900 sm:text-4xl">
          {article.title}
        </h1>

        <p className="text-sm text-stone-500">
          <span className="font-medium text-blue-600">
            {SOURCE_LABELS[article.source as ArticleSource] ?? article.source}
          </span>
          <span>
            {article.author ? ` · ${article.author}` : ''}
            {article.category ? ` · ${article.category}` : ''} ·{' '}
          </span>
          {timeAgo(article.publishedAt)}
          {' · '}
          {readTime(article)} min read
        </p>
      </div>

      {article?.imageUrl && (
        <SmartImage
          alt={article.title}
          src={article.imageUrl}
          className="aspect-video w-full rounded-xl object-cover"
        />
      )}

      <ArticleBody article={article} />

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-sm text-blue-600 transition hover:text-blue-700"
      >
        Read the full article at the source{' '}
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    </article>
  )
}

export default ArticleViewComponent
