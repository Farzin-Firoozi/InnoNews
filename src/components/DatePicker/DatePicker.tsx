import { useEffect, useState, type ReactNode } from 'react'
import { DayPicker } from 'react-day-picker'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom'

import { cn } from '@/utils/cn'
import { formatShortDate } from '@/utils/date'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  'aria-label': string
  icon?: ReactNode
  className?: string
}

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseISODate(value: string): Date | undefined {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const dayPickerClassNames = {
  months: 'flex flex-col cursor-pointer',
  month: 'flex flex-col gap-3 cursor-pointer',
  month_caption: 'flex items-center justify-center h-8',
  caption_label: 'text-sm font-medium text-stone-900 cursor-pointer',
  nav: 'flex items-center justify-between absolute inset-x-1 top-0 h-8',
  button_previous:
    'hover:text-brand cursor-pointer rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100',
  button_next:
    'hover:text-brand cursor-pointer rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100',
  chevron: 'h-4 w-4 fill-current cursor-pointer',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'flex-1 text-center text-xs font-normal text-stone-400',
  weeks: 'flex flex-col gap-1 mt-1',
  week: 'flex',
  day: 'flex flex-1 h-8 items-center justify-center p-0 cursor-pointer',
  day_button:
    'flex h-8 w-8 items-center justify-center rounded-full text-sm text-stone-700 transition hover:bg-stone-100 cursor-pointer',
  selected:
    '[&>button]:bg-brand [&>button]:text-white [&>button]:hover:bg-brand',
  today: '[&>button]:border [&>button]:border-brand/50 cursor-pointer',
  outside: '[&>button]:text-stone-300',
  disabled:
    '[&>button]:text-stone-200 [&>button]:hover:bg-transparent cursor-pointer',
}

/** Calendar popover built on react-day-picker, styled entirely with
 * Tailwind classes via its `classNames` API — no bundled CSS to fight. */
const DatePicker = ({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  icon,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selected = parseISODate(value)

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 16 }),
      size({
        apply({ rects, elements }) {
          // Match the trigger's width — but never so narrow the day grid
          // becomes unusable (7 columns need a floor around 240px).
          elements.floating.style.width = `${Math.max(rects.reference.width, 240)}px`
        },
      }),
    ],
  })

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !refs.reference.current ||
        !(refs.reference.current instanceof Element) ||
        refs.reference.current.contains(target)
      ) {
        return
      }
      if (refs.floating.current?.contains(target)) return
      setIsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, refs.reference, refs.floating])

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 text-left text-sm text-stone-700',
          className,
        )}
      >
        {icon}
        <span className="w-24 truncate">
          {value ? formatShortDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div
          // eslint-disable-next-line react-hooks/refs -- setFloating is a stable callback ref from floating-ui, not a `.current` read
          ref={refs.setFloating}
          style={floatingStyles}
          role="dialog"
          aria-label={`${ariaLabel} calendar`}
          className="z-40 rounded-2xl border border-stone-200 bg-white p-3 shadow-lg"
        >
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              onChange(date ? toISODate(date) : '')
              setIsOpen(false)
            }}
            classNames={dayPickerClassNames}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="hover:text-brand mt-1 w-full rounded-full py-1.5 text-center text-xs text-stone-500 transition hover:bg-stone-100"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DatePicker
