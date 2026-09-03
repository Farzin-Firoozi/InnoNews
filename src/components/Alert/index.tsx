import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type AlertProps = {
  className?: string
  children: ReactNode
}

const Alert = ({ className, children }: AlertProps) => {
  return (
    <p role="alert" className={cn('text-sm text-stone-500', className)}>
      {children}
    </p>
  )
}

export default Alert
