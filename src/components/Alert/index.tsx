import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type AlertProps = {
  className?: string
  children: ReactNode
}

const Alert = ({ className, children }: AlertProps) => {
  return (
    <p
      role="alert"
      className={cn(
        'rounded-lg border-red-400 bg-red-50 p-4 text-sm text-red-700',
        className,
      )}
    >
      {children}
    </p>
  )
}

export default Alert
