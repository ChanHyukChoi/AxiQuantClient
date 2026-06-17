import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { CalendarClock } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/patterns/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { fetchTimezoneList } from '@/hooks/api/queryCache'
import { TimezoneDrawer } from '@/pages/SchedulePage/TimezoneDrawer'
import { useScheduleHolidays } from '@/pages/SchedulePage/useScheduleHolidays'
import { useTimezoneColumns } from '@/pages/SchedulePage/useTimezoneColumns'
import { useTimezoneEditor } from '@/pages/SchedulePage/useTimezoneEditor'
import { useTimezonesData } from '@/pages/SchedulePage/useTimezonesData'
import type { TimezoneInfo } from '@/types/api'

const TIMEZONE_GRID_LAYOUT_KEY = 'axiquant.grid.layout.timezone.v1'

export const SchedulePage = () => {
  const { t } = useTranslation(['nav', 'schedule'])
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const data = useTimezonesData()
  const holidays = useScheduleHolidays()

  const editor = useTimezoneEditor({
    item: data.selectedItem,
    onDeleted: data.onItemDeleted,
    onCreated: async () => {
      const list = await fetchTimezoneList(qc)
      const newest = [...(list ?? [])].sort((a, b) => b.id - a.id)[0]
      if (newest) data.selectItem(newest)
    },
  })

  const baseColumns = useTimezoneColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: TIMEZONE_GRID_LAYOUT_KEY,
  })

  useEffect(() => {
    setPage(1)
  }, [data.searchQuery, data.filtered.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: TimezoneInfo) => {
    data.selectItem(row)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.schedule')}
        icon={<CalendarClock size={15} />}
        actions={
          <AddButton onClick={() => void editor.handleAdd()} loading={editor.isAdding} />
        }
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <>
            <Grid
              columns={columns}
              data={data.filtered}
              selectedId={data.selectedId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={data.setSearchQuery}
              searchPlaceholder={t('schedule:searchPlaceholder')}
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
                {t('schedule:loadError')}
              </p>
            ) : null}
          </>
        }
        drawer={
          <TimezoneDrawer
            item={data.selectedItem}
            editor={editor}
            holidays={holidays}
          />
        }
      />
    </div>
  )
}
