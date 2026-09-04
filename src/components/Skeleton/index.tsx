import type { FC, RefObject } from 'react'

import { cn } from '@/utils/cn'

type SkeletonProps = {
  className?: string
  ref?: RefObject<HTMLDivElement>
}

const Skeleton: FC<SkeletonProps> = (props) => {
  const { className, ref } = props

  return (
    <div ref={ref} className={cn('animate-pulse bg-gray-200', className)} />
  )
}

export default Skeleton
