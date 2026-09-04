import type { Article } from '@/types/article'

export const articleHref = (article: Article): string => {
  return `/article/${article.source}/${encodeURIComponent(article.id)}`
}

// CSS custom-ident: no colons/slashes/etc, so the raw source:id key isn't
// usable directly as a view-transition-name.
export const articleImageTransitionName = (article: Article): string => {
  const safeId = article.id.replace(/[^a-zA-Z0-9-]/g, '-')
  return `article-image-${article.source}-${safeId}`
}
