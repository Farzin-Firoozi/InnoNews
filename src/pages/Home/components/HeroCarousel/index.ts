import HeroCarouselComponent from './HeroCarousel'
import HeroCarouselSkeletonComponent from './HeroCarousel.skeleton'

const HeroCarousel = Object.assign(HeroCarouselComponent, {
  Skeleton: HeroCarouselSkeletonComponent,
})

export default HeroCarousel
