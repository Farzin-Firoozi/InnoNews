import Skeleton from '@/components/Skeleton'

const ArticleViewSkeletonComponent = () => {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        <h1 className="font-oranienbaum max-w-3xl text-3xl leading-snug text-stone-900 sm:text-4xl">
          <Skeleton className="h-10 w-full" />
        </h1>
      </div>
    </article>
  )
}

export default ArticleViewSkeletonComponent
