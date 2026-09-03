import { Link } from "react-router-dom";
import type { Article } from "../../types/article";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";
import { articleHref, tagLabel } from "./format";
import { readTime, timeAgo } from "@/utils/date";
import Skeleton from "@/components/Skeleton";

interface MetaProps {
  article: Article;
  tone?: "default" | "onImage";
}

function Meta({ article, tone = "default" }: MetaProps) {
  const toneClass = tone === "onImage" ? "text-white/75" : "text-stone-500";
  return (
    <p className={`font-roboto text-xs ${toneClass}`}>
      <span className="font-medium text-blue-600">{tagLabel(article)}</span>
      {" · "}
      {timeAgo(article.publishedAt)}
      {" · "}
      {readTime(article)} min read
    </p>
  );
}

/** Large split hero: image left, headline + summary right. Matches the
 * "Where To Watch John Wick" card in the reference layout. */
export function HeroSplitCard({ article }: { article: Article }) {
  return (
    <Link
      to={articleHref(article)}
      className="group grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center"
    >
      <ImageOrPlaceholder
        src={article.imageUrl}
        alt={article.title}
        className="aspect-[4/3] w-full rounded-2xl transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex flex-col gap-3">
        <Meta article={article} />
        <h2 className="font-oranienbaum text-2xl leading-snug text-stone-900 sm:text-3xl md:text-4xl">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-stone-700">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  );
}

/** Standard vertical card: image on top, meta + title below. The workhorse
 * used across Latest News, Editor's Pick row, Business/Sport columns. */
export function VerticalCard({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  return (
    <Link
      to={articleHref(article)}
      className={`group flex flex-col gap-3 ${className}`}
    >
      <ImageOrPlaceholder
        src={article.imageUrl}
        alt={article.title}
        className="aspect-[4/3] w-full rounded-xl transition duration-500 group-hover:scale-[1.02]"
      />
      <Meta article={article} />
      <h3 className="font-oranienbaum text-base leading-snug text-stone-900 line-clamp-2 group-hover:text-blue-600">
        {article.title}
      </h3>
    </Link>
  );
}

/** Compact horizontal card: small thumbnail left, text right. Used for the
 * stacked slots in "Must Read". */
export function HorizontalCard({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  return (
    <Link to={articleHref(article)} className={`group flex gap-3 ${className}`}>
      <ImageOrPlaceholder
        src={article.imageUrl}
        alt={article.title}
        className="h-20 w-24 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <h3 className="font-oranienbaum text-sm leading-snug text-stone-900 line-clamp-2 group-hover:text-blue-600">
          {article.title}
        </h3>
        <Meta article={article} />
      </div>
    </Link>
  );
}

/** Big overlay hero used by "Editor's Pick": full-bleed image with a dark
 * gradient and white text sitting on top. */
export function OverlayCard({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  return (
    <Link
      to={articleHref(article)}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
    >
      <ImageOrPlaceholder
        src={article.imageUrl}
        alt={article.title}
        className="h-full w-full transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
        <Meta article={article} tone="onImage" />
        <h2 className="font-oranienbaum text-2xl leading-snug text-white sm:text-3xl md:text-4xl line-clamp-2">
          {article.title}
        </h2>
        {article.description && (
          <p className="hidden max-w-xl text-sm leading-relaxed text-white/80 sm:line-clamp-2 md:block">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  );
}
