import i18n from '@/lib/i18n'
import { entityLabel, isStandaloneReader } from '@/lib/device/deviceHelpers'
import type { ReaderInfo } from '@/types/api'

export type ReaderKind = 'general' | 'standalone' | 'bio'
export type ReaderKindFilter = 'all' | ReaderKind

export const readerLabel = (reader: ReaderInfo): string => entityLabel('reader', reader)

export const formatReaderAddr = (addr: number): string =>
  addr > 0 ? `READER ${addr}` : i18n.t('empty', { ns: 'common' })

export const formatSioName = (sio: number, sioName?: string): string => {
  if (sioName?.trim()) return sioName
  if (sio <= 0) return 'Internal'
  return `SIO ${sio}`
}

export const detectReaderKind = (reader: ReaderInfo): ReaderKind => {
  if (isStandaloneReader(reader)) return 'standalone'
  if (reader.osdpflag > 0) return 'bio'
  return 'general'
}

export const readerKindLabel = (kind: ReaderKind): string =>
  i18n.t(`kind.${kind}`, { ns: 'reader' })

const MODE_LABELS: Record<number, string> = {
  0: 'DISABLE',
  1: 'CARD ONLY',
  2: 'CARD OR PIN',
  3: 'PIN ONLY',
}

const OFFLINE_LABELS: Record<number, string> = {
  0: 'LOCKED',
  1: 'UNLOCK',
}

const KEYPAD_LABELS: Record<number, string> = {
  0: 'NONE',
  1: 'HID',
  2: 'PIN',
}

export const formatDefMode = (mode: number): string => MODE_LABELS[mode] ?? String(mode)
export const formatOffMode = (mode: number): string => OFFLINE_LABELS[mode] ?? String(mode)
export const formatKpadMode = (mode: number): string => KEYPAD_LABELS[mode] ?? String(mode)

export const readerRowKey = (row: Pick<ReaderInfo, 'scp' | 'id'>): string =>
  `${row.scp}:${row.id}`

export const readerGridId = (row: Pick<ReaderInfo, 'scp' | 'id'>): number =>
  Math.max(0, row.scp) * 100000 + row.id

export interface ReaderTabDef {
  key: string
  label: string
}

export const tabsForReaderKind = (kind: ReaderKind): ReaderTabDef[] => {
  if (kind === 'standalone') {
    return [{ key: 'general', label: i18n.t('tab.general', { ns: 'reader' }) }]
  }
  if (kind === 'bio') {
    return [
      { key: 'general', label: i18n.t('tab.general', { ns: 'reader' }) },
      { key: 'protocol', label: i18n.t('tab.protocol', { ns: 'reader' }) },
    ]
  }
  return [
    { key: 'general', label: i18n.t('tab.general', { ns: 'reader' }) },
    { key: 'mode', label: i18n.t('tab.mode', { ns: 'reader' }) },
    { key: 'apb', label: i18n.t('tab.apb', { ns: 'reader' }) },
    { key: 'pair', label: i18n.t('tab.pair', { ns: 'reader' }) },
    { key: 'protocol', label: i18n.t('tab.protocol', { ns: 'reader' }) },
  ]
}
