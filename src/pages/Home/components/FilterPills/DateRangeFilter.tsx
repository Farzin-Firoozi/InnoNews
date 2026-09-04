import { CalendarDays } from 'lucide-react'

import DatePicker from '@/components/DatePicker'

type DateFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

const DateField = ({ label, value, onChange }: DateFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-widest text-stone-500 uppercase">
        {label}
      </span>
      <div className="focus-within:border-brand flex h-9 w-full items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3.5 transition sm:w-auto">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        <DatePicker
          value={value}
          onChange={onChange}
          placeholder="Any date"
          aria-label={`${label} date`}
        />
      </div>
    </div>
  )
}

type DateRangeFilterProps = {
  dateFrom: string
  dateTo: string
  onDateChange: (range: { from: string; to: string }) => void
}

/** Row on desktop, stacked columns on mobile — each field gets its own
 * full-width row on small screens instead of squeezing two into one pill. */
const DateRangeFilter = ({
  dateFrom,
  dateTo,
  onDateChange,
}: DateRangeFilterProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <DateField
        label="From"
        value={dateFrom}
        onChange={(value) => onDateChange({ from: value, to: dateTo })}
      />
      <DateField
        label="To"
        value={dateTo}
        onChange={(value) => onDateChange({ from: dateFrom, to: value })}
      />
    </div>
  )
}

export default DateRangeFilter
