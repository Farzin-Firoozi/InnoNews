import { useState, type FC, type ImgHTMLAttributes } from 'react'

import { Newspaper } from 'lucide-react'

import { cn } from '@/utils/cn'

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement>

const SmartImage: FC<SmartImageProps> = (props) => {
  const { src, alt, className, onLoad, onError, ...rest } = props

  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
        }}
        onError={(event) => {
          setHasError(true)
          onError?.(event)
        }}
        className={cn(
          'object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...rest}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('flex items-center justify-center bg-stone-100', className)}
    >
      <Newspaper className="h-6 w-6 text-stone-400" strokeWidth={1.5} />
    </div>
  )
}

export default SmartImage
