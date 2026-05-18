import { asRecordArray, optionalString } from '@/lib/wireJson'
import type { ModuleInfo } from '@/types/api/module'

export const wireToModuleInfo = (row: Record<string, unknown>): ModuleInfo => {
  const moduleType = optionalString(row, 'moduleType') ?? optionalString(row, 'type') ?? 'unknown'
  const connectedAt =
    optionalString(row, 'connectedAt') ?? optionalString(row, 'connected_at') ?? ''

  return {
    moduleType,
    connectedAt,
    id: optionalString(row, 'id') ?? moduleType,
    name: optionalString(row, 'name') ?? moduleType,
    type: moduleType,
    status:
      optionalString(row, 'status') ??
      (connectedAt ? 'connected' : 'disconnected'),
    version: optionalString(row, 'version'),
    description: optionalString(row, 'description'),
  }
}

export const parseModuleList = (data: unknown): ModuleInfo[] => {
  if (data == null) return []
  const rows = Array.isArray(data)
    ? asRecordArray(data)
    : (() => {
        if (typeof data !== 'object') return []
        const o = data as Record<string, unknown>
        return asRecordArray(o.items ?? o.data ?? o.modules)
      })()
  return rows.map(wireToModuleInfo)
}
