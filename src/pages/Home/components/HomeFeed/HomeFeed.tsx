import { useMemo } from 'react'

import type { HomeFeedProps } from '@/types/home'

import { pickTopCreators, splitFeed } from '../../utils'
import CategoryNews from '../CategoryNews'
import EditorsPick from '../EditorsPick'
import HeroCarousel from '../HeroCarousel'
import HotNews from '../HotNews'
import LatestNews from '../LatestNews'
import TopCreators from '../TopCreators'

const HomeFeed = ({
  carousel,
  feed,
  business,
  sport,
  isLoadingCategories = false,
}: HomeFeedProps) => {
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
      <CategoryNews
        business={business}
        sport={sport}
        isLoading={isLoadingCategories}
      />
      <TopCreators articles={topCreators} />
    </>
  )
}

export default HomeFeed
