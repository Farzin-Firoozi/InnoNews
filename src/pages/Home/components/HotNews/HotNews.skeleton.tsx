import { Flame } from 'lucide-react'

import Skeleton from '@/components/Skeleton'

const HotNewsSkeletonComponent = () => {
  return (
    <div className="group/marquee flex items-center gap-3 overflow-hidden rounded-full border border-stone-200 bg-stone-50 py-2 pr-2 pl-4">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium tracking-[0.15em] text-brand">
        <Flame className="h-4 w-4" strokeWidth={1.75} />
        HOT
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex h-5 items-center gap-4">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-5 w-56 rounded-full" />
          <Skeleton className="h-5 w-40 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default HotNewsSkeletonComponent
