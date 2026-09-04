import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useViewTransitionState } from 'react-router'

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import SmartImage from '@/components/SmartImage'

import { readTime, timeAgo } from '@/utils/date'
import { tagLabel } from '@/utils/format'
import { articleHref, articleImageTransitionName } from '@/utils/links'

import type { Article } from '@/types/article'

const AUTOPLAY_INTERVAL_MS = 5000
const MANUAL_PAUSE_MS = 5000

type HeroCarouselProps = {
  articles: Article[]
}

const HeroCarouselSlide = ({ article }: { article: Article }) => {
  const href = articleHref(article)
  const isTransitioning = useViewTransitionState(href)

  return (
    <Link
      to={href}
      viewTransition
      className="group grid min-w-0 flex-[0_0_100%] grid-cols-1 gap-5 md:grid-cols-2 md:items-center"
    >
      <div className="aspect-4/3 w-full overflow-hidden rounded-2xl">
        <SmartImage
          src={article.imageUrl ?? undefined}
          alt={article.title}
          style={
            isTransitioning
              ? { viewTransitionName: articleImageTransitionName(article) }
              : undefined
          }
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-roboto text-xs text-stone-500">
          <span className="text-brand font-medium">{tagLabel(article)}</span>
          {' · '}
          {timeAgo(article.publishedAt)}
          {' · '}
          {readTime(article)} min read
        </p>
        <h2 className="font-oranienbaum group-hover:text-brand text-2xl leading-snug text-stone-900 transition-colors sm:text-3xl md:text-4xl">
          {article.title}
        </h2>
        {article.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-stone-700">
            {article.description}
          </p>
        )}
      </div>
    </Link>
  )
}

const HeroCarouselComponent = ({ articles }: HeroCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const manualUntilRef = useRef(0)

  const count = articles.length

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || count <= 1) return

    const id = setInterval(() => {
      if (isHovering) return
      if (Date.now() < manualUntilRef.current) return
      emblaApi.scrollNext()
    }, AUTOPLAY_INTERVAL_MS)

    return () => clearInterval(id)
  }, [emblaApi, count, isHovering])

  const markManual = () => {
    manualUntilRef.current = Date.now() + MANUAL_PAUSE_MS
  }

  const goPrev = useCallback(() => {
    markManual()
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const goNext = useCallback(() => {
    markManual()
    emblaApi?.scrollNext()
  }, [emblaApi])

  const goTo = (i: number) => {
    markManual()
    emblaApi?.scrollTo(i)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') goPrev()
    if (event.key === 'ArrowRight') goNext()
  }

  if (count === 0) return null

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Top stories"
      tabIndex={0}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {articles.map((article) => (
            <HeroCarouselSlide
              key={`${article.source}:${article.id}`}
              article={article}
            />
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              goPrev()
            }}
            aria-label="Previous story"
            className="absolute top-1/2 left-1 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-stone-900 shadow-md transition group-hover/carousel:flex hover:bg-white md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              goNext()
            }}
            aria-label="Next story"
            className="absolute top-1/2 right-1 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 text-stone-900 shadow-md transition group-hover/carousel:flex hover:bg-white md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            {articles.map((a, i) => (
              <button
                key={`${a.source}:${a.id}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selectedIndex}
                className={`h-2.5 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-brand w-6' : 'w-2.5 bg-stone-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HeroCarouselComponent
