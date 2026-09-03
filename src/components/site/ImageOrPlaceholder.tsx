import { Newspaper } from "lucide-react";

interface ImageOrPlaceholderProps {
  src: string | null;
  alt: string;
  className?: string;
}

/** Real article image when we have one; otherwise a flat brand-tinted block
 * (never a stock/placeholder image service call). */
export function ImageOrPlaceholder({
  src,
  alt,
  className = "",
}: ImageOrPlaceholderProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-stone-50 ${className}`}
      role="img"
      aria-label={alt}
    >
      <Newspaper className="h-6 w-6 text-stone-500" strokeWidth={1.5} />
    </div>
  );
}
