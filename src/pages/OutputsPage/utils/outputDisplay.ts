import { entityLabel } from '@/lib/device/deviceHelpers'
import type { OutputInfo } from '@/types/api'

export const formatOutputAddr = (addr: number): string => `OUT ${addr}`

export const formatSioName = (sio: number, sioName?: string): string => {
  if (sioName?.trim()) return sioName
  if (sio <= 0) return 'Internal'
  return `SIO ${sio}`
}

export const outputLabel = (output: OutputInfo): string => entityLabel('output', output)
