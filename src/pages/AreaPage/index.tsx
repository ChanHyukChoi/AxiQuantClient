import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { AreaDrawer } from '@/pages/AreaPage/AreaDrawer'
import { useAreaColumns } from '@/pages/AreaPage/useAreaColumns'
import { useAreas } from '@/hooks/api/useArea'
import type { AreaInfo } from '@/types/api'

const AREA_GRID_LAYOUT_KEY = 'axiquant.grid.layout.area.v1'

export const AreaPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data: areaList, isLoading, isError } = useAreas()

  const filteredAreas = useMemo(() => {
    const list = areaList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [areaList, searchQuery])

  const selectedArea = useMemo(
    () => (areaList ?? []).find((a) => a.id === selectedId) ?? null,
    [areaList, selectedId],
  )

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filteredAreas.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: AreaInfo) => {
    setSelectedId(row.id)
  }

  const baseColumns = useAreaColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: AREA_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="영역"
        icon={<MapPin size={15} />}
        actions={<AddButton onClick={() => undefined} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.area"
        main={
          <>
            <Grid
              columns={columns}
              data={filteredAreas}
              selectedId={selectedId ?? undefined}
              onRowClick={handleRowClick}
              searchPlaceholder="영역명 검색..."
              onSearch={setSearchQuery}
              totalCount={filteredAreas.length}
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
                영역 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={<AreaDrawer area={selectedArea} />}
      />
    </div>
  )
}
