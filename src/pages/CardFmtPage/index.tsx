import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Binary } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/patterns/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { CardFmtDrawer } from '@/pages/CardFmtPage/CardFmtDrawer'
import { useCardFmtColumns } from '@/pages/CardFmtPage/useCardFmtColumns'
import { useCardFmts } from '@/hooks/api/useCardfmt'
import type { CardfmtInfo } from '@/types/api'

const CARDFMT_GRID_LAYOUT_KEY = 'axiquant.grid.layout.cardfmt.v1'

export const CardFmtPage = () => {
  const { t } = useTranslation(['nav', 'cardFmt'])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data: cardfmtList, isLoading, isError } = useCardFmts()

  const filteredItems = useMemo(() => {
    const list = cardfmtList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((item) => item.name.toLowerCase().includes(q))
  }, [cardfmtList, searchQuery])

  const selectedCardfmt = useMemo(
    () => (cardfmtList ?? []).find((item) => item.id === selectedId) ?? null,
    [cardfmtList, selectedId],
  )

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filteredItems.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: CardfmtInfo) => {
    setSelectedId(row.id)
  }

  const baseColumns = useCardFmtColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: CARDFMT_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.cardfmt')}
        icon={<Binary size={15} style={{ color: '#7f77dd' }} />}
        actions={<AddButton onClick={() => undefined} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <>
            <Grid
              columns={columns}
              data={filteredItems}
              selectedId={selectedId ?? undefined}
              onRowClick={handleRowClick}
              searchPlaceholder={t('cardFmt:searchPlaceholder')}
              onSearch={setSearchQuery}
              totalCount={filteredItems.length}
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
                {t('cardFmt:loadError')}
              </p>
            ) : null}
          </>
        }
        drawer={<CardFmtDrawer cardfmt={selectedCardfmt} />}
      />
    </div>
  )
}
