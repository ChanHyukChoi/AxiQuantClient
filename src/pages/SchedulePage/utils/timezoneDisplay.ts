import { fallbackTimezoneName } from '@/lib/entityDisplayLabels'
import type { TimezoneInfo } from '@/types/api'

export const timezoneRangeLabel = (item: TimezoneInfo): string => {
  if (item.startTime && item.endTime) return `${item.startTime} – ${item.endTime}`
  const first = item.intervals[0]
  if (first) return `${first.stm} – ${first.etm}`
  return '—'
}

export const timezoneDisplayName = (item: TimezoneInfo): string =>
  fallbackTimezoneName(item.name)
