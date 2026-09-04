import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

type ArticleCardVerticalSkeletonProps = {
  className?: string
}

const ArticleCardVerticalSkeleton = ({
  className,
}: ArticleCardVerticalSkeletonProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-3 w-40 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
    </div>
  )
}

export default ArticleCardVerticalSkeleton
