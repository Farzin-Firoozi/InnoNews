import HorizontalComponent from './ArticleCard.Horizontal'
import HorizontalSkeletonComponent from './ArticleCard.Horizontal.skeleton'
import OverlayComponent from './ArticleCard.Overlay'
import OverlaySkeletonComponent from './ArticleCard.Overlay.skeleton'
import VerticalComponent from './ArticleCard.Vertical'
import VerticalSkeletonComponent from './ArticleCard.Vertical.skeleton'

const ArticleCard = {
  Vertical: Object.assign(VerticalComponent, {
    Skeleton: VerticalSkeletonComponent,
  }),
  Horizontal: Object.assign(HorizontalComponent, {
    Skeleton: HorizontalSkeletonComponent,
  }),
  Overlay: Object.assign(OverlayComponent, {
    Skeleton: OverlaySkeletonComponent,
  }),
}

export default ArticleCard
