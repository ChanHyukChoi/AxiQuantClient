import { useCallback, useEffect, useState } from 'react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { TabToolbar } from '@/layouts/TabToolbar'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { HolidayDetailPanel } from '@/pages/TimezoneHolidayPage/components/HolidayDetailPanel'
import { useHolidayColumns } from '@/pages/TimezoneHolidayPage/useHolidayColumns'
import { useHolidayEditor } from '@/pages/TimezoneHolidayPage/useHolidayEditor'
import { useHolidaysData } from '@/pages/TimezoneHolidayPage/useHolidaysData'
import type { HolidayInfo } from '@/types/api'

const HOLIDAY_GRID_LAYOUT_KEY = 'axiquant.grid.layout.holiday.v1'

export const HolidayTab = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const data = useHolidaysData()

  const editor = useHolidayEditor({
    item: data.selectedItem,
    useMock: data.useMock,
    patchMockItem: data.patchMockItem,
    addMockItem: data.addMockItem,
    removeMockItem: data.removeMockItem,
    onDeleted: data.onItemDeleted,
  })

  const baseColumns = useHolidayColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: HOLIDAY_GRID_LAYOUT_KEY,
  })

  useEffect(() => {
    setPage(1)
  }, [data.searchQuery, data.filtered.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: HolidayInfo) => {
    data.selectItem(row)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TabToolbar>
        <AddButton onClick={editor.handleAdd} />
      </TabToolbar>

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.holiday"
        main={
          <>
            <Grid
              columns={columns}
              data={data.filtered}
              selectedId={data.selectedId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={data.setSearchQuery}
              searchPlaceholder="휴일 검색..."
              totalCount={data.filtered.length}
              loading={data.isLoading}
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
            {data.isError ? (
              <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
                휴일 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={<HolidayDetailPanel item={data.selectedItem} editor={editor} />}
      />
    </div>
  )
}
