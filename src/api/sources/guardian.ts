import { client } from "../index";
import type { Article, ArticleFilters } from "../../types/article";
import { dateOnly, requireKey, rethrowFriendly, toIsoDate } from "./shared";

const LABEL = "The Guardian";
const BASE_URL = "https://content.guardianapis.com";

const SHOW_FIELDS = "headline,trailText,body,byline,thumbnail,firstPublicationDate";

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionId?: string;
  sectionName?: string;
  fields?: {
    headline?: string;
    trailText?: string;
    body?: string;
    byline?: string;
    thumbnail?: string;
  };
}

interface GuardianSearchResponse {
  response: {
    status: string;
    results?: GuardianResult[];
  };
}

interface GuardianItemResponse {
  response: {
    status: string;
    content?: GuardianResult;
  };
}

/** Guardian bodies are HTML; the detail page renders plain text. */
function stripHtml(html?: string): string | null {
  if (!html) return null;
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || null;
}

function mapArticle(raw: GuardianResult): Article {
  return {
    id: raw.id,
    source: "guardian",
    title: raw.fields?.headline ?? raw.webTitle,
    description: stripHtml(raw.fields?.trailText),
    content: stripHtml(raw.fields?.body),
    author: raw.fields?.byline ?? null,
    url: raw.webUrl,
    imageUrl: raw.fields?.thumbnail ?? null,
    publishedAt: toIsoDate(raw.webPublicationDate),
    category: raw.sectionName ?? raw.sectionId ?? null,
  };
}

function getApiKey(): string {
  return requireKey(
    import.meta.env.VITE_GUARDIAN_API_KEY,
    "VITE_GUARDIAN_API_KEY",
    LABEL,
  );
}

export async function fetchArticles(
  filters: ArticleFilters,
): Promise<Article[]> {
  const params: Record<string, string | number> = {
    "api-key": getApiKey(),
    "show-fields": SHOW_FIELDS,
    "order-by": "newest",
    "page-size": 20,
  };

  if (filters.query) params.q = filters.query;
  // Guardian sections map closely onto our category list, except its
  // "sport" section slug is singular where our category is "sports".
  if (filters.category) {
    const category = filters.category.toLowerCase();
    params.section = category === "sports" ? "sport" : category;
  }
  const from = dateOnly(filters.from);
  const to = dateOnly(filters.to);
  if (from) params["from-date"] = from;
  if (to) params["to-date"] = to;

  try {
    const { data } = await client.get<GuardianSearchResponse>(
      `${BASE_URL}/search`,
      { params },
    );
    return (data.response.results ?? []).map(mapArticle);
  } catch (error) {
    rethrowFriendly(error, LABEL);
  }
}

/** Guardian exposes an item endpoint at /{item-id}. */
export async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    const { data } = await client.get<GuardianItemResponse>(
      `${BASE_URL}/${id}`,
      {
        params: { "api-key": getApiKey(), "show-fields": SHOW_FIELDS },
      },
    );
    return data.response.content ? mapArticle(data.response.content) : null;
  } catch {
    // Let the caller fall back to the cached list result.
    return null;
  }
}
