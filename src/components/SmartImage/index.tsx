import { useState, type FC, type ImgHTMLAttributes } from 'react'

import { Newspaper } from 'lucide-react'

import { cn } from '@/utils/cn'

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement>

const SmartImage: FC<SmartImageProps> = (props) => {
  const { src, alt, className, onLoad, ...rest } = props

  const [loaded, setLoaded] = useState(false)

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
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
      className={cn('flex items-center justify-center bg-gray-100', className)}
    >
      <Newspaper className="h-6 w-6 text-gray-500" strokeWidth={1.5} />
    </div>
  )
}

export default SmartImage
