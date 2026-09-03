import type { ReactNode } from 'react'

type StatusMessageProps = {
  tone?: 'muted' | 'brand'
  role?: 'alert'
  children: ReactNode
}

const StatusMessage = ({
  tone = 'muted',
  role,
  children,
}: StatusMessageProps) => {
  const toneClass = tone === 'brand' ? 'text-red-600' : 'text-stone-500'

  return (
    <p className={`${toneClass} text-sm`} role={role}>
      {children}
    </p>
  )
}

export default StatusMessage
