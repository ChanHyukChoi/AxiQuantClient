import {
  Activity,
  ArrowLeftFromLine,
  ArrowRightToLine,
  Cpu,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'
import { fallbackDeviceKindLabel } from '@/lib/entityDisplayLabels'
import type { InputInfo, ModuleInfo, OutputInfo, ReaderInfo, ScpInfo, SioInfo } from '@/types/api'

export type DeviceEntityKind = 'scp' | 'sio' | 'reader' | 'input' | 'output' | 'module'

export type DeviceTypeFilter = 'all' | 'reader' | 'input' | 'output'

export const isDeviceActive = (active: number): boolean => active !== 0

export const statusDotColor = (active: number): string =>
  isDeviceActive(active) ? '#4caf7d' : '#555a63'

export const DEVICE_ICON_COLORS: Record<Exclude<DeviceEntityKind, 'module'>, string> = {
  scp: '#4f9cf9',
  sio: '#7f77dd',
  reader: '#4caf7d',
  input: '#e8a838',
  output: '#e06060',
}

export const DEVICE_ICONS: Record<Exclude<DeviceEntityKind, 'module'>, LucideIcon> = {
  scp: Cpu,
  sio: Cpu,
  reader: ScanLine,
  input: ArrowRightToLine,
  output: ArrowLeftFromLine,
}

export const MODULE_ICON = Activity
export const MODULE_ICON_COLOR = '#9b8fd4'

export const isStandaloneReader = (reader: ReaderInfo): boolean => reader.scp <= 0

export const entityLabel = (
  kind: Exclude<DeviceEntityKind, 'module'>,
  item: ScpInfo | SioInfo | ReaderInfo | InputInfo | OutputInfo,
): string => {
  const name = item.name?.trim()
  if (name) return name
  return fallbackDeviceKindLabel(kind)
}

export const moduleLabel = (module: ModuleInfo): string => {
  const at = formatConnectedAt(module.connectedAt)
  return at ? `${module.moduleType} · ${at}` : module.moduleType
}

export const formatConnectedAt = (connectedAt: string): string => {
  if (!connectedAt.trim()) return '—'
  const d = new Date(connectedAt)
  if (Number.isNaN(d.getTime())) return connectedAt
  return d.toLocaleString()
}

export const findModuleConnectedAt = (
  modules: ModuleInfo[] | null | undefined,
  scp: ScpInfo | null,
): string | null => {
  if (!scp || !modules?.length) return null
  const idStr = String(scp.id)
  const match =
    modules.find(
      (m) =>
        m.moduleType === `Scp:${idStr}` ||
        m.moduleType === `SCP:${idStr}` ||
        m.moduleType.endsWith(`:${idStr}`) ||
        m.moduleType.toLowerCase().includes(scp.name.toLowerCase()),
    ) ?? modules.find((m) => m.moduleType.toLowerCase().includes('scp'))
  return match?.connectedAt ?? null
}
