import { cn } from '@/utils/cn'

type BrandNameProps = {
  className?: string
}

const BrandName = ({ className }: BrandNameProps) => {
  return (
    <span className={cn('font-oranienbaum text-red-600 text-2xl', className)}>
      InnoNews
    </span>
  )
}

export default BrandName
