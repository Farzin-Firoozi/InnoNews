import Skeleton from '@/components/Skeleton'

const ArticleViewSkeleton = () => {
  return (
    <article className="flex flex-col gap-6">
      <Skeleton className="h-8 w-full rounded-full" />

      <Skeleton className="mt-2 h-5 w-1/2 rounded-full" />

      <Skeleton className="aspect-video w-full rounded-xl" />
    </article>
  )
}

export default ArticleViewSkeleton
