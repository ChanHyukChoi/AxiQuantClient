import {
  ArrowLeftFromLine,
  ArrowRightToLine,
  Cpu,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'
import type { InputInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'

export type DeviceEntityKind = 'scp' | 'sio' | 'reader' | 'input' | 'output'

export const isDeviceActive = (active: number): boolean => active !== 0

export const statusDotColor = (active: number): string =>
  isDeviceActive(active) ? '#4caf7d' : '#555a63'

export const DEVICE_ICON_COLORS: Record<DeviceEntityKind, string> = {
  scp: '#4f9cf9',
  sio: '#7f77dd',
  reader: '#4caf7d',
  input: '#e8a838',
  output: '#e06060',
}

export const DEVICE_ICONS: Record<DeviceEntityKind, LucideIcon> = {
  scp: Cpu,
  sio: Cpu,
  reader: ScanLine,
  input: ArrowRightToLine,
  output: ArrowLeftFromLine,
}

export const isStandaloneReader = (reader: ReaderInfo): boolean => reader.scp <= 0

export const entityLabel = (
  kind: DeviceEntityKind,
  item: ScpInfo | SioInfo | ReaderInfo | InputInfo | OutputInfo,
): string => {
  const name = item.name?.trim()
  if (name) return name
  return `${kind.toUpperCase()} #${item.id}`
}

export const resolveScpId = (
  row: { scp?: number; scpId?: number },
  fallback: number,
): number => {
  if (typeof row.scp === 'number' && Number.isFinite(row.scp) && row.scp > 0) return row.scp
  if (typeof row.scpId === 'number' && Number.isFinite(row.scpId) && row.scpId > 0) return row.scpId
  return fallback
}
