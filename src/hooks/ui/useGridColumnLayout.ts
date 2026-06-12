import { useMemo } from 'react'
import type { ColumnDef } from '@/components/primitive/Grid'
import { useGridLayout } from '@/hooks/ui/useGridLayout'

interface UseGridColumnLayoutOptions {
  storageKey: string
  legacyWidthsKey?: string
}

export const useGridColumnLayout = <T>(
  baseColumns: ColumnDef<T>[],
  { storageKey, legacyWidthsKey }: UseGridColumnLayoutOptions,
) => {
  const layout = useGridLayout(baseColumns, { storageKey, legacyWidthsKey })

  const layoutGridProps = useMemo(
    () => ({
      resizableColumns: true as const,
      onColumnWidthChange: layout.setColumnWidth,
      reorderableColumns: true as const,
      onColumnReorder: layout.moveColumn,
    }),
    [layout.setColumnWidth, layout.moveColumn],
  )

  return {
    columns: layout.columns,
    minGridWidth: layout.minGridWidth,
    columnOptions: layout.columnOptions,
    isLayoutCustomized: layout.isLayoutCustomized,
    resetLayout: layout.resetLayout,
    setColumnVisible: layout.setColumnVisible,
    layoutGridProps,
  }
}
