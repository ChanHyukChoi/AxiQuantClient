import {
  fallbackReaderName,
  fallbackScpName,
  fallbackTimezoneName,
} from '@/lib/entityDisplayLabels'
import type { AccLvRdrInfo } from '@/types/api'

export interface AccLvReaderRow {
  scpId: number
  scpName: string
  readerId: number
  readerName: string
  timezoneId: number
  timezoneName: string
}

export const accLvReaderKey = (scpId: number, readerId: number): string =>
  `${scpId}:${readerId}`

export const toAccLvReaderRows = (
  readers: AccLvRdrInfo[],
  scpNameMap: Record<number, string>,
  timezoneNameMap: Record<number, string>,
): AccLvReaderRow[] =>
  readers.map((r) => {
    const tz = r.tz ?? 0
    return {
      scpId: r.scp,
      scpName: scpNameMap[r.scp] ?? fallbackScpName(r.scpName),
      readerId: r.rdr,
      readerName: fallbackReaderName(r.readerName),
      timezoneId: tz,
      timezoneName: tz > 0 ? (timezoneNameMap[tz] ?? fallbackTimezoneName()) : '—',
    }
  })
