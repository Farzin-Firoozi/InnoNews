import ArticleViewComponent from './ArticleView'
import ArticleViewSkeletonComponent from './ArticleView.skeleton'

const ArticleView = Object.assign(ArticleViewComponent, {
  Skeleton: ArticleViewSkeletonComponent,
})

export default ArticleView
