import type { Article } from '@/types/article'

export const articleHref = (article: Article): string => {
  return `/article/${article.source}/${encodeURIComponent(article.id)}`
}
