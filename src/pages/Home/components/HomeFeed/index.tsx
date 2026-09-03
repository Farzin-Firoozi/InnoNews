import { useMemo } from 'react'

import { HeroCarousel } from '@/components/site/HeroCarousel'

import type { Article } from '@/types/article'

import { pickTopCreators, splitFeed } from '../../utils'
import CategoryNews from '../CategoryNews'
import EditorsPick from '../EditorsPick'
import HotNews from '../HotNews'
import LatestNews from '../LatestNews'
import MustRead from '../MustRead'
import TopCreators from '../TopCreators'

type HomeFeedProps = {
  carousel: Article[]
  feed: Article[]
  business: Article[]
  sport: Article[]
}

const HomeFeed = ({ carousel, feed, business, sport }: HomeFeedProps) => {
  const { latest, mustRead, editorsPick, marquee } = splitFeed(feed)
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
      <MustRead articles={mustRead} />
      <EditorsPick articles={editorsPick} />
      <CategoryNews business={business} sport={sport} />
      <TopCreators articles={topCreators} />
    </>
  )
}

export default HomeFeed
