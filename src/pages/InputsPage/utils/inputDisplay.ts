import { entityLabel } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { InputInfo } from '@/types/api'

export const formatInputAddr = (addr: number): string => `IN ${addr}`

export const formatInputMode = (mode: number): string => {
  if (mode === 1) return 'NORMALLY OPEN'
  if (mode === 0) return 'NORMALLY CLOSED'
  return String(mode)
}

export const formatSioName = (sio: number, sioName?: string): string => {
  if (sioName?.trim()) return sioName
  if (sio <= 0) return 'Internal'
  return `SIO ${sio}`
}

export const inputLabel = (input: InputInfo): string => entityLabel('input', input)
