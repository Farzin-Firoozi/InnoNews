import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "../api/articles";
import type { Article, ArticleFilters } from "../types/article";

/** Search/filter results, kept on a distinct query key from the home feed
 * so the home feed stays cached/stable independent of search activity. */
export function useSearchResults(filters: ArticleFilters) {
  const isFiltering = Boolean(
    filters.query || filters.from || filters.to || filters.category || filters.source,
  );

  return useQuery<Article[]>({
    queryKey: ["search-articles", filters],
    queryFn: () => fetchAllArticles(filters),
    staleTime: 5 * 60 * 1000,
    enabled: isFiltering,
  });
}
