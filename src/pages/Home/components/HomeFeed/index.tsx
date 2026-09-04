import { useMemo } from 'react'

import type { Article } from '@/types/article'

import { pickTopCreators, splitFeed } from '../../utils'
import CategoryNews from '../CategoryNews'
import EditorsPick from '../EditorsPick'
import HeroCarousel from '../HeroCarousel'
import HotNews from '../HotNews'
import LatestNews from '../LatestNews'
import TopCreators from '../TopCreators'

type HomeFeedProps = {
  carousel: Article[]
  feed: Article[]
  business: Article[]
  sport: Article[]
}

const HomeFeed = ({ carousel, feed, business, sport }: HomeFeedProps) => {
  const { latest, editorsPick, marquee } = splitFeed(feed)
  const topCreators = useMemo(() => pickTopCreators(feed), [feed])

  return (
    <>
      <HotNews articles={marquee} />

      {carousel.length > 0 && (
        <section>
          <HeroCarousel articles={carousel} />
        </section>
      )}

      <LatestNews articles={latest} />
      <EditorsPick articles={editorsPick} />
      <CategoryNews business={business} sport={sport} />
      <TopCreators articles={topCreators} />
    </>
  )
}

export default HomeFeed
