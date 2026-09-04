import ArticleCard from '@/components/ArticleCard'

import SectionHeader from '../SectionHeader'

const SKELETON_COUNT = 4

const LatestNewsSkeleton = () => {
  return (
    <section>
      <SectionHeader title="Latest News" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ArticleCard.Vertical.Skeleton key={i} />
        ))}
      </div>
    </section>
  )
}

export default LatestNewsSkeleton
