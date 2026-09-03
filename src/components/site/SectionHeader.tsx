import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="font-oranienbaum text-2xl text-stone-900 sm:text-[28px]">
        {title}
      </h2>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm font-medium text-red-600 transition hover:gap-1.5"
        >
          See all
          <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}
