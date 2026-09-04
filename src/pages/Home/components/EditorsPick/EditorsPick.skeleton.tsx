import ArticleCard from '@/components/ArticleCard'

import SectionHeader from '../SectionHeader'

const GRID_SKELETON_COUNT = 4

const EditorsPickSkeleton = () => {
  return (
    <section>
      <SectionHeader title="Editor's Pick" />
      <div className="flex flex-col gap-5">
        <ArticleCard.Overlay.Skeleton className="h-72 sm:h-96" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
          {Array.from({ length: GRID_SKELETON_COUNT }, (_, i) => (
            <ArticleCard.Vertical.Skeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EditorsPickSkeleton
