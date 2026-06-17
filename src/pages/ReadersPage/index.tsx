import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScanLine } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { ReaderDrawer } from '@/pages/ReadersPage/ReaderDrawer'
import { useReaderColumns } from '@/pages/ReadersPage/useReaderColumns'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import { readerGridId } from '@/pages/ReadersPage/utils/readerDisplay'
import { useReadersData } from '@/pages/ReadersPage/useReadersData'

const READERS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.readers.v1'

export const ReadersPage = () => {
  const { t } = useTranslation(['nav', 'reader'])
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { filteredRows, setSearchQuery, isLoading, isError } = useReadersData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: readerGridId(r) })),
    [filteredRows],
  )

  const selected = useMemo(
    () => filteredRows.find((r) => readerGridId(r) === selectedGridId) ?? null,
    [filteredRows, selectedGridId],
  )

  useEffect(() => {
    setPage(1)
  }, [filteredRows.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: ReaderDisplayRow & { id: number }) => {
    if (editMode) setEditMode(false)
    setSelectedGridId(row.id)
  }

  const baseColumns = useReaderColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: READERS_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.readers')}
        icon={<ScanLine size={15} />}
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
              searchPlaceholder={t('reader:searchPlaceholder')}
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
                {t('reader:loadError')}
              </p>
            ) : null}
          </>
        }
        drawer={
          <ReaderDrawer
            reader={selected}
            onEditModeChange={setEditMode}
          />
        }
      />
    </div>
  )
}
