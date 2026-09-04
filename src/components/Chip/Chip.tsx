import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type ChipProps = {
  children: ReactNode
  pressed?: boolean
  onClick?: () => void
  className?: string
  'aria-label'?: string
}

const Chip = ({
  children,
  pressed = false,
  onClick,
  className,
  'aria-label': ariaLabel,
}: ChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      className={cn(
        'shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm capitalize transition',
        pressed
          ? 'border-brand bg-brand text-white'
          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-brand/50',
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Chip
