import { asRecordArray, firstNumber, optionalString } from '@/lib/wireJson'
import type {
  CreateTimezoneRequest,
  TimezoneInfo,
  TimezoneInterval,
  UpdateTimezoneRequest,
} from '@/types/api/timezone'

const parseInterval = (row: Record<string, unknown>, index: number): TimezoneInterval => ({
  idx: firstNumber(row, ['idx']) || index,
  dmask: firstNumber(row, ['dmask', 'daysOfWeek']),
  hmask: firstNumber(row, ['hmask']),
  stm: optionalString(row, 'stm') ?? optionalString(row, 'startTime') ?? '00:00',
  etm: optionalString(row, 'etm') ?? optionalString(row, 'endTime') ?? '23:59',
})

const deriveFromIntervals = (intervals: TimezoneInterval[]): Pick<TimezoneInfo, 'startTime' | 'endTime' | 'daysOfWeek'> => {
  const first = intervals[0]
  if (!first) return {}
  return {
    startTime: first.stm,
    endTime: first.etm,
    daysOfWeek: first.dmask,
  }
}

export const wireToTimezoneInfo = (row: Record<string, unknown>): TimezoneInfo => {
  const intervals = asRecordArray(row.intervals).map(parseInterval)
  const derived = deriveFromIntervals(intervals)

  return {
    id: firstNumber(row, ['id']),
    name: optionalString(row, 'name') ?? '',
    intervals,
    startTime: optionalString(row, 'startTime') ?? derived.startTime,
    endTime: optionalString(row, 'endTime') ?? derived.endTime,
    daysOfWeek: 'daysOfWeek' in row ? firstNumber(row, ['daysOfWeek']) : derived.daysOfWeek,
  }
}

export const parseTimezoneList = (data: unknown): TimezoneInfo[] => {
  if (data == null) return []
  const rows = Array.isArray(data)
    ? asRecordArray(data)
    : (() => {
        if (typeof data !== 'object') return []
        const o = data as Record<string, unknown>
        return asRecordArray(o.items ?? o.data ?? o.timezones)
      })()
  return rows.map(wireToTimezoneInfo)
}

const uiToIntervals = (tz: CreateTimezoneRequest | UpdateTimezoneRequest): TimezoneInterval[] => {
  if (tz.intervals?.length) return tz.intervals
  return [
    {
      idx: 0,
      dmask: tz.daysOfWeek ?? 0x7f,
      hmask: 0,
      stm: tz.startTime ?? '00:00',
      etm: tz.endTime ?? '23:59',
    },
  ]
}

export const timezoneToWire = (
  tz: CreateTimezoneRequest | UpdateTimezoneRequest,
  id: number,
): Record<string, unknown> => ({
  id,
  name: tz.name,
  intervals: uiToIntervals(tz).map((iv) => ({
    idx: iv.idx,
    dmask: iv.dmask,
    hmask: iv.hmask,
    stm: iv.stm,
    etm: iv.etm,
  })),
})
