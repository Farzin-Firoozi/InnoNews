import ArticleCard from '@/components/ArticleCard'
import Skeleton from '@/components/Skeleton'

const COLUMN_SKELETON_COUNT = 2

const CategoryColumnSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-5 h-[37px] w-32 rounded" />
      <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: COLUMN_SKELETON_COUNT }, (_, i) => (
          <ArticleCard.Vertical.Skeleton key={i} />
        ))}
      </div>
    </div>
  )
}

const CategoryNewsSkeleton = () => {
  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <CategoryColumnSkeleton />
      <CategoryColumnSkeleton />
    </section>
  )
}

export default CategoryNewsSkeleton
