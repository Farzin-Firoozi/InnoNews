import { useParams } from 'react-router'

import ArticleView from './components/ArticleView'
import Alert from '@/components/Alert'

import type { ArticleDetailParams } from '@/types/article'

import { useArticle } from '@/hooks/useArticle'

const ArticleDetailsPage = () => {
  const params = useParams<ArticleDetailParams>()

  const { error, isError, isPending, data: article } = useArticle(params)

  return (
    <main className="container">
      {isError && (
        <Alert>
          {error instanceof Error ? error.message : 'Failed to load article.'}
        </Alert>
      )}

      {!isPending && !isError && !article && (
        <Alert>This article is not available.</Alert>
      )}

      {article ? <ArticleView article={article} /> : <ArticleView.Skeleton />}
    </main>
  )
}

export default ArticleDetailsPage
