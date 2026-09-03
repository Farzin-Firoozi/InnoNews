import { useMemo } from "react";
import { useArticles } from "./useArticles";
import type { Article } from "../types/article";

/** Powers the homepage feed: a single unsorted fetch split into the top 3
 * articles for the hero carousel and the remainder for the curated
 * sections below it. Keeps us to one network round-trip per source. */
export function useHomeNews() {
  const query = useArticles({});
  const articles = useMemo(() => query.data ?? [], [query.data]);

  const carousel = useMemo(() => articles.slice(0, 3), [articles]);
  const feed = useMemo(() => articles.slice(3), [articles]);

  return {
    carousel,
    feed,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  };
}

export type UseHomeNewsResult = ReturnType<typeof useHomeNews>;
export type { Article };
