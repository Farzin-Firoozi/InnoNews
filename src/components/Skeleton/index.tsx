import { cn } from '@/utils/cn'

type SkeletonProps = {
  className?: string
}

const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn('animate-pulse bg-gray-200', className)} />
}

export default Skeleton
