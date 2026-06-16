import { asRecordArray, firstNumber } from '@/lib/wire/wireJson'
import type { CreateHolidayRequest, HolidayInfo, UpdateHolidayRequest } from '@/types/api/holiday'

const bool = (v: unknown): boolean => {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true'
  return false
}

export const wireToHolidayInfo = (row: Record<string, unknown>): HolidayInfo => ({
  id: typeof row.id === 'number' ? Math.trunc(row.id) : Number(row.id) || 0,
  timezoneId: firstNumber(row, ['timezoneId', 'tzid', 'tz']),
  name: String(row.name ?? ''),
  date: String(row.date ?? ''),
  isRecurring: bool(row.isRecurring ?? row.repeat),
})

export const parseHolidayList = (data: unknown): HolidayInfo[] => {
  if (data == null) return []
  const rows = Array.isArray(data)
    ? asRecordArray(data)
    : (() => {
        if (typeof data !== 'object') return []
        const o = data as Record<string, unknown>
        return asRecordArray(o.items ?? o.data ?? o.holidays)
      })()
  return rows.map(wireToHolidayInfo)
}

export const holidayToWire = (
  holiday: CreateHolidayRequest | UpdateHolidayRequest,
  id: number,
): Record<string, unknown> => ({
  id,
  timezoneId: holiday.timezoneId,
  tzid: holiday.timezoneId,
  tz: holiday.timezoneId,
  name: holiday.name,
  date: holiday.date,
  repeat: holiday.isRecurring ?? false,
  isRecurring: holiday.isRecurring ?? false,
  days: 0,
  tmask: 0,
  ext: '',
})
