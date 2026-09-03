import { client } from "../index";
import type { Article, ArticleFilters } from "../../types/article";
import { dateOnly, requireKey, rethrowFriendly, toIsoDate } from "./shared";

const LABEL = "New York Times";
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const IMAGE_BASE = "https://www.nytimes.com/";

interface NytMultimedia {
  url?: string;
  subtype?: string;
}

interface NytDoc {
  _id: string;
  uri?: string;
  web_url: string;
  abstract?: string | null;
  snippet?: string | null;
  lead_paragraph?: string | null;
  source?: string;
  pub_date?: string;
  section_name?: string | null;
  news_desk?: string | null;
  multimedia?: NytMultimedia[];
  headline?: { main?: string | null };
  byline?: { original?: string | null };
}

interface NytResponse {
  status: string;
  response?: { docs?: NytDoc[] };
}

function resolveImage(multimedia?: NytMultimedia[]): string | null {
  const first = multimedia?.find((item) => Boolean(item.url));
  if (!first?.url) return null;
  return first.url.startsWith("http") ? first.url : `${IMAGE_BASE}${first.url}`;
}

function mapArticle(raw: NytDoc): Article {
  return {
    id: raw._id,
    source: "nytimes",
    title: raw.headline?.main ?? "Untitled",
    description: raw.abstract ?? raw.snippet ?? null,
    content: raw.lead_paragraph ?? raw.abstract ?? null,
    author: raw.byline?.original ?? null,
    url: raw.web_url,
    imageUrl: resolveImage(raw.multimedia),
    publishedAt: toIsoDate(raw.pub_date),
    category: raw.section_name ?? raw.news_desk ?? null,
  };
}

/** NYT expects begin_date/end_date as YYYYMMDD. */
function toCompactDate(value?: string): string | undefined {
  const date = dateOnly(value);
  return date ? date.replace(/-/g, "") : undefined;
}

export async function fetchArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const params: Record<string, string | number> = {
    "api-key": requireKey(
      import.meta.env.VITE_NYT_API_KEY,
      "VITE_NYT_API_KEY",
      LABEL,
    ),
    sort: "newest",
  };

  if (filters.query) params.q = filters.query;
  if (filters.category) {
    // NYT renamed this filter field from `section_name` to `section.name`
    // in their Apr 2025 Article Search API change; values are title-cased.
    const section =
      filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
    params.fq = `section.name:("${section}")`;
  }
  const begin = toCompactDate(filters.from);
  const end = toCompactDate(filters.to);
  if (begin) params.begin_date = begin;
  if (end) params.end_date = end;

  try {
    const { data } = await client.get<NytResponse>(BASE_URL, { params });
    return (data.response?.docs ?? [])
      .filter((doc) => Boolean(doc.web_url))
      .map(mapArticle);
  } catch (error) {
    rethrowFriendly(error, LABEL);
  }
}

/**
 * Article Search has no by-id lookup; the detail page falls back to the cached
 * list query.
 */
export async function fetchArticleById(): Promise<Article | null> {
  return null;
}
