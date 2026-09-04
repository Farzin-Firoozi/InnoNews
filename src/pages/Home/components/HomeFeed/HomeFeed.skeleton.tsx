import CategoryNews from '../CategoryNews'
import EditorsPick from '../EditorsPick'
import HeroCarousel from '../HeroCarousel'
import HotNews from '../HotNews'
import LatestNews from '../LatestNews'
import TopCreators from '../TopCreators'

const HomeFeedSkeleton = () => {
  return (
    <>
      <HotNews.Skeleton />
      <section>
        <HeroCarousel.Skeleton />
      </section>
      <LatestNews.Skeleton />
      <EditorsPick.Skeleton />
      <CategoryNews.Skeleton />
      <TopCreators.Skeleton />
    </>
  )
}

export default HomeFeedSkeleton
