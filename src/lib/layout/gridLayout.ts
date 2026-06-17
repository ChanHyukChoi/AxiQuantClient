import type { ColumnDef } from '@/components/primitive/Grid'

export interface GridLayoutPersist {
  widths?: Record<string, number>
  order?: string[]
  hidden?: string[]
}

export const emptyGridLayout = (): GridLayoutPersist => ({})

export const parseGridLayout = (raw: string): GridLayoutPersist => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyGridLayout()
    const obj = parsed as Record<string, unknown>
    const result: GridLayoutPersist = {}

    if (obj.widths && typeof obj.widths === 'object' && obj.widths !== null) {
      const widths: Record<string, number> = {}
      for (const [key, value] of Object.entries(obj.widths)) {
        if (typeof value === 'number' && Number.isFinite(value)) widths[key] = value
      }
      if (Object.keys(widths).length > 0) result.widths = widths
    }

    if (Array.isArray(obj.order)) {
      result.order = obj.order.filter((k): k is string => typeof k === 'string')
    }

    if (Array.isArray(obj.hidden)) {
      result.hidden = obj.hidden.filter((k): k is string => typeof k === 'string')
    }

    return result
  } catch {
    return emptyGridLayout()
  }
}

export const readGridLayout = (
  storageKey: string,
  legacyWidthsKey?: string,
): GridLayoutPersist => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) return parseGridLayout(raw)
    if (legacyWidthsKey) {
      const legacy = localStorage.getItem(legacyWidthsKey)
      if (legacy) {
        const widthsOnly = parseGridLayout(
          JSON.stringify({ widths: JSON.parse(legacy) }),
        )
        if (widthsOnly.widths && Object.keys(widthsOnly.widths).length > 0) {
          return widthsOnly
        }
      }
    }
  } catch {
    /* ignore */
  }
  return emptyGridLayout()
}

export const writeGridLayout = (storageKey: string, layout: GridLayoutPersist) => {
  const hasWidths = layout.widths && Object.keys(layout.widths).length > 0
  const hasOrder = layout.order && layout.order.length > 0
  const hasHidden = layout.hidden && layout.hidden.length > 0
  if (!hasWidths && !hasOrder && !hasHidden) {
    localStorage.removeItem(storageKey)
    return
  }
  localStorage.setItem(storageKey, JSON.stringify(layout))
}

export const resolveColumnOrder = <T>(
  baseColumns: ColumnDef<T>[],
  order?: string[],
): string[] => {
  const defaultKeys = baseColumns.map((c) => c.key)
  if (!order?.length) return defaultKeys
  const seen = new Set<string>()
  const resolved: string[] = []
  for (const key of order) {
    if (defaultKeys.includes(key) && !seen.has(key)) {
      resolved.push(key)
      seen.add(key)
    }
  }
  for (const key of defaultKeys) {
    if (!seen.has(key)) resolved.push(key)
  }
  return resolved
}

export const applyGridLayout = <T>(
  baseColumns: ColumnDef<T>[],
  layout: GridLayoutPersist,
): ColumnDef<T>[] => {
  const order = resolveColumnOrder(baseColumns, layout.order)
  const hidden = new Set(layout.hidden ?? [])
  const byKey = new Map(baseColumns.map((c) => [c.key, c]))

  return order
    .filter((key) => !hidden.has(key))
    .map((key) => {
      const col = byKey.get(key)
      if (!col) return null
      const w = layout.widths?.[key]
      return w != null ? { ...col, width: w } : col
    })
    .filter((c): c is ColumnDef<T> => c != null)
}

export const isGridLayoutCustomized = <T>(
  baseColumns: ColumnDef<T>[],
  layout: GridLayoutPersist,
): boolean => {
  if (layout.hidden && layout.hidden.length > 0) return true
  if (layout.widths && Object.keys(layout.widths).length > 0) return true
  const defaultOrder = baseColumns.map((c) => c.key).join(',')
  const currentOrder = resolveColumnOrder(baseColumns, layout.order).join(',')
  return currentOrder !== defaultOrder
}

/** fromKey를 toKey 위치(앞)로 이동 */
export const moveColumnInOrder = (
  order: string[],
  fromKey: string,
  toKey: string,
): string[] => {
  const fromIdx = order.indexOf(fromKey)
  const toIdx = order.indexOf(toKey)
  if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return order
  const next = [...order]
  const [item] = next.splice(fromIdx, 1)
  const insertIdx = fromIdx < toIdx ? toIdx - 1 : toIdx
  next.splice(insertIdx, 0, item)
  return next
}
