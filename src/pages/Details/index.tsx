import { ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router'

import ArticleView from './components/ArticleView'
import Alert from '@/components/Alert'

import type { ArticleDetailParams } from '@/types/article'

import { useArticle } from '@/hooks/useArticle'

const ArticleDetailsPage = () => {
  const params = useParams<ArticleDetailParams>()

  const { error, isError, isPending, data: article } = useArticle(params)

  return (
    <main className="container flex flex-col gap-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-stone-500">
          <li>
            <Link to="/" className="transition hover:text-brand">
              Home
            </Link>
          </li>
          {article?.category && (
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <Link
                to={`/?categories=${encodeURIComponent(article.category)}`}
                className="capitalize transition hover:text-brand"
              >
                {article.category}
              </Link>
            </li>
          )}
          <li className="flex min-w-0 items-center gap-1.5 text-stone-900">
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {article?.title ?? 'Article'}
            </span>
          </li>
        </ol>
      </nav>

      {isError && (
        <Alert>
          {error instanceof Error ? error.message : 'Failed to load article.'}
        </Alert>
      )}

      {!isPending && !isError && !article && (
        <Alert>
          {params.source === 'newsapi'
            ? "This is a NewsAPI article, and NewsAPI's free tier has no lookup-by-id endpoint — it can only be shown after being loaded from the list first. This is an expected limitation, not a bug: open it from the home feed instead of a fresh/reloaded link."
            : 'This article is not available. It may have dropped out of the cached results — go back and search again.'}
        </Alert>
      )}

      {article ? <ArticleView article={article} /> : <ArticleView.Skeleton />}
    </main>
  )
}

export default ArticleDetailsPage
