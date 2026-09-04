import Chip from '@/components/Chip'

/** Fixed widths so the skeleton occupies the same footprint an average
 * author-name chip would, avoiding layout shift once real data loads. */
const AUTHOR_CHIP_SKELETON_WIDTHS = ['w-24', 'w-16', 'w-28', 'w-20', 'w-16']

type FilterPillsSkeletonProps = {
  label: string
}

const FilterPillsSkeleton = ({ label }: FilterPillsSkeletonProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-[0.1em] text-stone-500 uppercase">
        {label}
      </span>
      <div className="flex gap-2 overflow-hidden pb-1">
        <Chip.Skeleton className="w-14" />
        {AUTHOR_CHIP_SKELETON_WIDTHS.map((width, i) => (
          <Chip.Skeleton key={i} className={width} />
        ))}
      </div>
    </div>
  )
}

export default FilterPillsSkeleton
