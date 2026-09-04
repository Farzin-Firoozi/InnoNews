import Skeleton from '@/components/Skeleton'

import SectionHeader from '../SectionHeader'

const SKELETON_COUNT = 4

const TopCreatorsSkeleton = () => {
  return (
    <section>
      <SectionHeader title="Top Creator" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopCreatorsSkeleton
