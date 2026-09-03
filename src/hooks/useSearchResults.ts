import { useQuery } from "@tanstack/react-query";
import { searchArticles } from "../api/articles";
import type { Article, SelectedFilters } from "../types/article";

/** Search/filter results, kept on a distinct query key from the home feed
 * so the home feed stays cached/stable independent of search activity. */
export function useSearchResults(filters: SelectedFilters) {
  const isFiltering = Boolean(
    filters.query ||
      filters.from ||
      filters.to ||
      filters.categories.length ||
      filters.sources.length ||
      filters.authors.length,
  );

  return useQuery<Article[]>({
    queryKey: ["search-articles", filters],
    queryFn: () => searchArticles(filters),
    staleTime: 5 * 60 * 1000,
    enabled: isFiltering,
  });
}
