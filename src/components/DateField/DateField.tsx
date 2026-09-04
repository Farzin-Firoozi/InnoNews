import { useRef } from 'react'

import { formatShortDate } from '@/utils/date'

type DateFieldProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  'aria-label': string
  className?: string
}

/** A native `<input type="date">` rendered invisibly on top of a custom
 * label, so the picker/keyboard-entry behavior stays native (and
 * accessible) while the visible text is consistent across browsers instead
 * of each engine's own date-input rendering. */
const DateField = ({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  className,
}: DateFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <span className={className}>
      <span className="relative inline-flex h-5 w-16 items-center sm:w-24">
        <span
          className="pointer-events-none truncate text-sm whitespace-nowrap text-stone-700"
          aria-hidden="true"
        >
          {value ? formatShortDate(value) : placeholder}
        </span>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => inputRef.current?.showPicker?.()}
          aria-label={ariaLabel}
          className="absolute inset-0 h-full w-full cursor-pointer [color-scheme:light] opacity-0"
        />
      </span>
    </span>
  )
}

export default DateField
