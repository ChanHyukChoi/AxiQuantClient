import type { OutputInfo } from '@/types/api'

export interface OutputDisplayRow extends OutputInfo {
  scpName: string
  sioName: string
}

export const outputRowKey = (row: Pick<OutputInfo, 'scp' | 'id'>): string => `${row.scp}:${row.id}`

export const outputGridId = (row: Pick<OutputInfo, 'scp' | 'id'>): number =>
  row.scp * 100000 + row.id
