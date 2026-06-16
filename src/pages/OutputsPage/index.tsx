import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeftFromLine } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { OutputDrawer } from '@/pages/OutputsPage/OutputDrawer'
import { useOutputColumns } from '@/pages/OutputsPage/useOutputColumns'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputDisplayTypes'
import { outputGridId } from '@/pages/OutputsPage/outputDisplayTypes'
import { useOutputsData } from '@/pages/OutputsPage/useOutputsData'

const OUTPUTS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.outputs.v1'

export const OutputsPage = () => {
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { filteredRows, setSearchQuery, isLoading, isError } = useOutputsData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: outputGridId(r) })),
    [filteredRows],
  )

  const selected = useMemo(
    () => filteredRows.find((r) => outputGridId(r) === selectedGridId) ?? null,
    [filteredRows, selectedGridId],
  )

  useEffect(() => {
    setPage(1)
  }, [filteredRows.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: OutputDisplayRow & { id: number }) => {
    if (editMode) setEditMode(false)
    setSelectedGridId(row.id)
  }

  const baseColumns = useOutputColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: OUTPUTS_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="출력"
        icon={<ArrowLeftFromLine size={15} />}
        actions={<AddButton onClick={() => undefined} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.outputs"
        main={
          <>
            <Grid
              columns={columns}
              data={gridData}
              selectedId={selectedGridId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={setSearchQuery}
              searchPlaceholder="출력 검색..."
              totalCount={filteredRows.length}
              loading={isLoading}
              pagination={{
                page,
                pageSize,
                onPageChange: setPage,
                onPageSizeChange: handlePageSizeChange,
              }}
              resizableColumns
              onColumnWidthChange={setColumnWidth}
              reorderableColumns
              onColumnReorder={moveColumn}
            />
            {isError ? (
              <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
                출력 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={
          <OutputDrawer
            row={selected}
            onEditModeChange={setEditMode}
          />
        }
      />
    </div>
  )
}
