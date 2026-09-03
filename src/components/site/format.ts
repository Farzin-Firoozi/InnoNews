import type { Article, ArticleSource } from '../../types/article'
import { SOURCE_LABELS } from '../../types/article'

/** Label shown as the small colored tag under a card: prefer category,
 * fall back to the source name when the API didn't supply one. */
export function tagLabel(article: Article): string {
  if (article.category) {
    return article.category.charAt(0).toUpperCase() + article.category.slice(1)
  }
  return SOURCE_LABELS[article.source as ArticleSource] ?? article.source
}

export function sourceLabel(article: Article): string {
  return SOURCE_LABELS[article.source as ArticleSource] ?? article.source
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

export function articleHref(article: Article): string {
  return `/article/${article.source}/${encodeURIComponent(article.id)}`
}
