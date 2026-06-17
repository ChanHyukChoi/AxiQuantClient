import i18n from '@/lib/i18n'
import { fallbackTimezoneName } from '@/lib/entityDisplayLabels'
import type { HolidayInfo, TimezoneInfo } from '@/types/api'

export const timezoneRangeLabel = (item: TimezoneInfo): string => {
  if (item.startTime && item.endTime) return `${item.startTime} – ${item.endTime}`
  const first = item.intervals[0]
  if (first) return `${first.stm} – ${first.etm}`
  return i18n.t('empty', { ns: 'common' })
}

export const timezoneDisplayName = (item: TimezoneInfo): string =>
  fallbackTimezoneName(item.name)

export const holidayDisplayLabel = (item: HolidayInfo): string =>
  item.name?.trim() || i18n.t('holiday.defaultName', { ns: 'schedule' })
