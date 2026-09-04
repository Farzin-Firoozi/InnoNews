import { useQuery } from '@tanstack/react-query'

import { fetchAllArticles } from '../api/articles'
import type { Article, ArticleFilters } from '../types/article'

export const articlesQueryKey = (filters: ArticleFilters) =>
  ['articles', filters] as const

export function useArticles(
  filters: ArticleFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<Article[]>({
    queryKey: articlesQueryKey(filters),
    queryFn: () => fetchAllArticles(filters),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled,
  })
}
