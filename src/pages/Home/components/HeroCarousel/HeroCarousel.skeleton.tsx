import Skeleton from '@/components/Skeleton'

/** Mirrors HeroCarousel's slide + dots markup 1:1 (same grid, image aspect
 * ratio, text block, dot row) so swapping it in causes no layout shift. */
const HeroCarouselSkeletonComponent = () => {
  return (
    <div className="relative">
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 md:items-center">
        <Skeleton className="aspect-4/3 w-full rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-40 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-full rounded-md sm:h-9 md:h-10" />
            <Skeleton className="h-8 w-4/5 rounded-md sm:h-9 md:h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Skeleton className="h-2.5 w-6 rounded-full" />
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
      </div>
    </div>
  )
}

export default HeroCarouselSkeletonComponent
