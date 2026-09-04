import LatestNewsComponent from './LatestNews'
import LatestNewsSkeletonComponent from './LatestNews.skeleton'

const LatestNews = Object.assign(LatestNewsComponent, {
  Skeleton: LatestNewsSkeletonComponent,
})

export default LatestNews
