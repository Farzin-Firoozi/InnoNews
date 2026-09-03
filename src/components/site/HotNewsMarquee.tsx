import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import type { Article } from "../../types/article";
import { articleHref } from "./format";

export function HotNewsMarquee({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  const headlines = (
    <>
      {articles.map((article) => (
        <Link
          key={`${article.source}:${article.id}`}
          to={articleHref(article)}
          className="mx-4 inline-flex items-center gap-2 text-sm text-stone-700 transition hover:text-red-600"
        >
          {article.title}
          <span className="text-stone-200" aria-hidden="true">
            •
          </span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="group/marquee flex items-center gap-3 overflow-hidden rounded-full border border-stone-200 bg-stone-50 py-2 pl-4 pr-2">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium tracking-[0.15em] text-red-600">
        <Flame className="h-4 w-4" strokeWidth={1.75} />
        HOT
      </span>
      <div className="min-w-0 overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {headlines}
          {headlines}
        </div>
      </div>
    </div>
  );
}
