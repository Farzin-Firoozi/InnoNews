import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'

import { fetchArticleById } from '../api/articles'
import type { Article, ArticleDetailParams } from '../types/article'

/** Scans every cached ['articles', ...] or ['search-articles', ...] list result for a matching source + id. */
function findInListCache(
  queryClient: QueryClient,
  source: string,
  id: string,
): Article | null {
  const cached = queryClient.getQueriesData<Article[]>({
    predicate: (query) =>
      query.queryKey[0] === 'articles' ||
      query.queryKey[0] === 'search-articles',
  })

  for (const [, articles] of cached) {
    const match = articles?.find(
      (article) => article.source === source && article.id === id,
    )
    if (match) return match
  }
  return null
}

/**
 * Loads a single article via each source's real by-id endpoint where one
 * exists (Guardian, NYT). NewsAPI's free tier has no such endpoint at all —
 * that's a genuine API limitation, not a caching choice — so it, and any
 * failed lookup, resolve from the cached list query instead.
 */
export function useArticle(params: ArticleDetailParams) {
  const { source = '', id = '' } = params

  const queryClient = useQueryClient()

  return useQuery<Article | null>({
    queryKey: ['article', source, id],
    queryFn: async () => {
      const direct = await fetchArticleById({ source, id })

      if (direct) return direct

      return findInListCache(queryClient, source, id)
    },
    enabled: Boolean(source && id),
    staleTime: 5 * 60 * 1000,
  })
}
