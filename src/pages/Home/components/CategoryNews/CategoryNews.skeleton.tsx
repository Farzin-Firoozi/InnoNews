import ArticleCard from '@/components/ArticleCard'

import SectionHeader from '../SectionHeader'

const COLUMN_SKELETON_COUNT = 2

const CategoryColumnSkeleton = ({ title }: { title: string }) => {
  return (
    <div>
      <SectionHeader title={title} />
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
      <CategoryColumnSkeleton title="Business" />
      <CategoryColumnSkeleton title="Sport News" />
    </section>
  )
}

export default CategoryNewsSkeleton
