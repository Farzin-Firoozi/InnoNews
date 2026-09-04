import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

type ArticleCardOverlaySkeletonProps = {
  className?: string
}

const ArticleCardOverlaySkeleton = ({
  className,
}: ArticleCardOverlaySkeletonProps) => {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
        <Skeleton className="h-3 w-40 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-4/5 rounded-md sm:h-8 md:h-9" />
          <Skeleton className="h-7 w-3/5 rounded-md sm:h-8 md:h-9" />
        </div>
        <Skeleton className="hidden h-4 w-2/3 rounded-md md:block" />
      </div>
    </div>
  )
}

export default ArticleCardOverlaySkeleton
