import Skeleton from '@/components/Skeleton'

import { cn } from '@/utils/cn'

type ChipSkeletonProps = {
  className?: string
}

const ChipSkeleton = ({ className }: ChipSkeletonProps) => {
  return (
    <Skeleton className={cn('h-9 w-20 shrink-0 rounded-full', className)} />
  )
}

export default ChipSkeleton
