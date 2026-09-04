import HomeFeedComponent from './HomeFeed'
import HomeFeedSkeletonComponent from './HomeFeed.skeleton'

const HomeFeed = Object.assign(HomeFeedComponent, {
  Skeleton: HomeFeedSkeletonComponent,
})

export default HomeFeed
