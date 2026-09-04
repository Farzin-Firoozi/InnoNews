import { useMemo } from 'react'

import type { Article } from '@/types/article'

const AUTHOR_OPTIONS_LIMIT = 12

/**
 * Author chip options derived from whatever's currently on screen, so picking
 * a source (or any other filter) narrows the options to match.
 *
 * Already-selected authors are always kept in the list — otherwise there'd be
 * no chip left to click to deselect them — and they don't count against the
 * limit, so new options keep appearing no matter how many are selected.
 */
export function useAvailableAuthors(articles: Article[], selected: string[]) {
  return useMemo(() => {
    const seen = new Set<string>(selected)
    const options = [...seen]
    let discovered = 0

    for (const article of articles) {
      if (discovered >= AUTHOR_OPTIONS_LIMIT) break
      const author = article.author
      if (!author || seen.has(author)) continue
      seen.add(author)
      options.push(author)
      discovered += 1
    }

    return options
  }, [articles, selected])
}
