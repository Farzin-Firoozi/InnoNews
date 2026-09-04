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
      <Skeleton className="h-4 w-40 rounded-full" />
      <div className="flex h-11 flex-col">
        <Skeleton className="h-[1.375rem] w-full rounded-md" />
        <Skeleton className="h-[1.375rem] w-3/4 rounded-md" />
      </div>
    </div>
  )
}

export default ArticleCardVerticalSkeleton
