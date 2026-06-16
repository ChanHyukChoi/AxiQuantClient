import type { InputInfo } from '@/types/api'

export interface InputDisplayRow extends InputInfo {
  scpName: string
  sioName: string
}

export const inputRowKey = (row: Pick<InputInfo, 'scp' | 'id'>): string => `${row.scp}:${row.id}`

export const inputGridId = (row: Pick<InputInfo, 'scp' | 'id'>): number =>
  row.scp * 100000 + row.id
