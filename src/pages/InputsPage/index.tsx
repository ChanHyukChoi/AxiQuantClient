import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightToLine } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { InputDrawer } from '@/pages/InputsPage/InputDrawer'
import { useInputColumns } from '@/pages/InputsPage/useInputColumns'
import type { InputDisplayRow } from '@/pages/InputsPage/inputDisplayTypes'
import { inputGridId } from '@/pages/InputsPage/inputDisplayTypes'
import { useInputsData } from '@/pages/InputsPage/useInputsData'

const INPUTS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.inputs.v1'

export const InputsPage = () => {
  const { t } = useTranslation('nav')
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { filteredRows, setSearchQuery, isLoading, isError } = useInputsData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: inputGridId(r) })),
    [filteredRows],
  )

  const selected = useMemo(
    () => filteredRows.find((r) => inputGridId(r) === selectedGridId) ?? null,
    [filteredRows, selectedGridId],
  )

  useEffect(() => {
    setPage(1)
  }, [filteredRows.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: InputDisplayRow & { id: number }) => {
    if (editMode) setEditMode(false)
    setSelectedGridId(row.id)
  }

  const baseColumns = useInputColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: INPUTS_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.inputs')}
        icon={<ArrowRightToLine size={15} />}
        actions={<AddButton onClick={() => undefined} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <>
            <Grid
              columns={columns}
              data={gridData}
              selectedId={selectedGridId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={setSearchQuery}
              searchPlaceholder="입력 검색..."
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
                입력 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={
          <InputDrawer
            row={selected}
            onEditModeChange={setEditMode}
          />
        }
      />
    </div>
  )
}
