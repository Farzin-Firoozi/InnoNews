import type { Article } from '@/types/article'

export const articleKey = (article: Article) =>
  `${article.source}:${article.id}`

export const splitFeed = (feed: Article[]) => ({
  latest: feed.slice(0, 4),
  mustRead: feed.slice(4, 12),
  editorsPick: feed.slice(12, 17),
  marquee: feed.slice(0, 10),
})

export const pickTopCreators = (feed: Article[], limit = 4): Article[] => {
  const seen = new Map<string, Article>()

  for (const article of feed) {
    if (article.author && !seen.has(article.author)) {
      seen.set(article.author, article)
    }
    if (seen.size >= limit) break
  }

  return [...seen.values()]
}
