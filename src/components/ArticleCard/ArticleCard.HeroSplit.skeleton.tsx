import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

type ArticleCardHeroSplitSkeletonProps = {
  className?: string
}

const ArticleCardHeroSplitSkeleton = ({
  className,
}: ArticleCardHeroSplitSkeletonProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 md:items-center',
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full rounded-md sm:h-9 md:h-10" />
          <Skeleton className="h-8 w-4/5 rounded-md sm:h-9 md:h-10" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default ArticleCardHeroSplitSkeleton
