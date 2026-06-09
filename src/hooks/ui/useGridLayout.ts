import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@/components/primitive/Grid'
import { sumColumnWidths } from '@/lib/layout/columnWidths'
import {
  applyGridLayout,
  emptyGridLayout,
  isGridLayoutCustomized,
  moveColumnInOrder,
  readGridLayout,
  resolveColumnOrder,
  writeGridLayout,
  type GridLayoutPersist,
} from '@/lib/grid/gridLayout'

export interface GridColumnOption {
  key: string
  header: string
  visible: boolean
  hideable: boolean
}

interface UseGridLayoutOptions {
  storageKey: string
  /** 이전 widths-only localStorage 키 (마이그레이션) */
  legacyWidthsKey?: string
}

export const useGridLayout = <T>(
  baseColumns: ColumnDef<T>[],
  { storageKey, legacyWidthsKey }: UseGridLayoutOptions,
) => {
  const [layout, setLayout] = useState<GridLayoutPersist>(() =>
    readGridLayout(storageKey, legacyWidthsKey),
  )

  const defaultOrder = useMemo(() => baseColumns.map((c) => c.key), [baseColumns])

  const fullOrder = useMemo(
    () => resolveColumnOrder(baseColumns, layout.order),
    [baseColumns, layout.order],
  )

  const columns = useMemo(
    () => applyGridLayout(baseColumns, layout),
    [baseColumns, layout],
  )

  const minGridWidth = useMemo(() => sumColumnWidths(columns), [columns])

  const isLayoutCustomized = useMemo(
    () => isGridLayoutCustomized(baseColumns, layout),
    [baseColumns, layout],
  )

  const columnOptions = useMemo<GridColumnOption[]>(() => {
    const hidden = new Set(layout.hidden ?? [])
    return fullOrder.map((key) => {
      const col = baseColumns.find((c) => c.key === key)
      if (!col) return null
      return {
        key: col.key,
        header: col.header,
        visible: !hidden.has(col.key),
        hideable: col.hideable !== false,
      }
    }).filter((c): c is GridColumnOption => c != null)
  }, [baseColumns, fullOrder, layout.hidden])

  const persist = useCallback(
    (next: GridLayoutPersist) => {
      setLayout(next)
      writeGridLayout(storageKey, next)
    },
    [storageKey],
  )

  const setColumnWidth = useCallback(
    (key: string, width: number) => {
      setLayout((prev) => {
        const next = {
          ...prev,
          widths: { ...prev.widths, [key]: width },
        }
        writeGridLayout(storageKey, next)
        return next
      })
    },
    [storageKey],
  )

  const moveColumn = useCallback(
    (fromKey: string, toKey: string) => {
      if (fromKey === toKey) return
      setLayout((prev) => {
        const full = resolveColumnOrder(baseColumns, prev.order)
        const order = moveColumnInOrder(full, fromKey, toKey)
        if (order.every((key, i) => key === full[i])) return prev
        const next = { ...prev, order }
        writeGridLayout(storageKey, next)
        return next
      })
    },
    [baseColumns, storageKey],
  )

  const setColumnVisible = useCallback(
    (key: string, visible: boolean) => {
      const col = baseColumns.find((c) => c.key === key)
      if (!col || col.hideable === false) return

      const hiddenSet = new Set(layout.hidden ?? [])
      const visibleCount = fullOrder.filter((k) => !hiddenSet.has(k)).length

      if (!visible && visibleCount <= 1) return

      if (visible) hiddenSet.delete(key)
      else hiddenSet.add(key)

      persist({
        ...layout,
        hidden: hiddenSet.size > 0 ? Array.from(hiddenSet) : undefined,
      })
    },
    [baseColumns, fullOrder, layout, persist],
  )

  const setColumnOrder = useCallback(
    (order: string[]) => {
      persist({ ...layout, order })
    },
    [layout, persist],
  )

  const resetLayout = useCallback(() => {
    setLayout(emptyGridLayout())
    localStorage.removeItem(storageKey)
  }, [storageKey])

  return {
    columns,
    columnOptions,
    minGridWidth,
    isLayoutCustomized,
    setColumnWidth,
    moveColumn,
    setColumnVisible,
    setColumnOrder,
    resetLayout,
    defaultOrder,
  }
}
