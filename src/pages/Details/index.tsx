import { useParams } from 'react-router'

import ArticleView from './components/ArticleView'
import StatusMessage from './components/StatusMessage'

import type { ArticleDetailParams } from '@/types/article'

import { useArticle } from '@/hooks/useArticle'

const ArticleDetailsPage = () => {
  const params = useParams<ArticleDetailParams>()

  const { error, isError, isPending, data: article } = useArticle(params)

  return (
    <main className="container">
      {isError && (
        <StatusMessage tone="brand" role="alert">
          {error instanceof Error ? error.message : 'Failed to load article.'}
        </StatusMessage>
      )}

      {!isPending && !isError && !article && (
        <StatusMessage>This article is not available.</StatusMessage>
      )}

      {article ? <ArticleView article={article} /> : <ArticleView.Skeleton />}
    </main>
  )
}

export default ArticleDetailsPage
