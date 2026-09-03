import HotNewsComponent from './HotNews'
import HotNewsSkeletonComponent from './HotNews.skeleton'

const HotNews = Object.assign(HotNewsComponent, {
  Skeleton: HotNewsSkeletonComponent,
})

export default HotNews
