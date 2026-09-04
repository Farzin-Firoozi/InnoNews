import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

type ArticleCardHorizontalSkeletonProps = {
  className?: string
}

const ArticleCardHorizontalSkeleton = ({
  className,
}: ArticleCardHorizontalSkeletonProps) => {
  return (
    <div className={cn('flex gap-3', className)}>
      <Skeleton className="h-20 w-24 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-2/3 rounded-md" />
        </div>
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
    </div>
  )
}

export default ArticleCardHorizontalSkeleton
