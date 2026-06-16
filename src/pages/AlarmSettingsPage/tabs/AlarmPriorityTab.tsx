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
import { AlarmPriorityDrawer } from '@/pages/AlarmSettingsPage/components/AlarmPriorityDrawer'
import { useAlarmPriorityColumns } from '@/pages/AlarmSettingsPage/useAlarmPriorityColumns'
import { useAlarmPrioritiesData } from '@/pages/AlarmSettingsPage/useAlarmPrioritiesData'
import { useAlarmPriorityEditor } from '@/pages/AlarmSettingsPage/useAlarmPriorityEditor'
const ALARM_PRIORITY_GRID_LAYOUT_KEY = 'axiquant.grid.layout.alarm-priority.v1'

export const AlarmPriorityTab = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const data = useAlarmPrioritiesData()

  const editor = useAlarmPriorityEditor({
    item: data.selectedItem,
    onDeleted: data.onItemDeleted,
  })

  const baseColumns = useAlarmPriorityColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: ALARM_PRIORITY_GRID_LAYOUT_KEY,
  })

  useEffect(() => {
    setPage(1)
  }, [data.items.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TabToolbar>
        <AddButton
          onClick={() => void editor.handleAdd()}
          loading={editor.isAdding}
        />
      </TabToolbar>

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.alarm-priority"
        main={
          <>
            <Grid
              columns={columns}
              data={data.items}
              selectedId={data.selectedId ?? undefined}
              onRowClick={data.selectItem}
              totalCount={data.items.length}
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
                우선순위 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={
          <AlarmPriorityDrawer item={data.selectedItem} editor={editor} />
        }
      />
    </div>
  )
}
