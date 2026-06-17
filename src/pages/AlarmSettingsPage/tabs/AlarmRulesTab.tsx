import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { TabToolbar } from '@/layouts/TabToolbar'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { AlarmRuleDrawer } from '@/pages/AlarmSettingsPage/components/AlarmRuleDrawer'
import { useAlarmRuleColumns } from '@/pages/AlarmSettingsPage/useAlarmRuleColumns'
import { useAlarmRulesData } from '@/pages/AlarmSettingsPage/useAlarmRulesData'
import { useAlarmRuleEditor } from '@/pages/AlarmSettingsPage/useAlarmRuleEditor'

const ALARM_RULES_GRID_LAYOUT_KEY = 'axiquant.grid.layout.alarm-rules.v1'

export const AlarmRulesTab = () => {
  const { t } = useTranslation('alarm')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const data = useAlarmRulesData()

  const editor = useAlarmRuleEditor({
    rule: data.selectedRule,
    scpNameMap: data.scpNameMap,
    onDeleted: data.onRuleDeleted,
  })

  const baseColumns = useAlarmRuleColumns(data.scpNameMap)
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: ALARM_RULES_GRID_LAYOUT_KEY,
  })

  useEffect(() => {
    setPage(1)
  }, [data.searchQuery, data.filteredRules.length])

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
        storageKey="axiquant.drawer.alarm-rules"
        main={
          <>
            <Grid
              columns={columns}
              data={data.filteredRules}
              selectedId={data.selectedId ?? undefined}
              onRowClick={data.selectRule}
              onSearch={data.setSearchQuery}
              searchPlaceholder={t('searchPlaceholder')}
              totalCount={data.filteredRules.length}
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
                {t('rulesLoadError')}
              </p>
            ) : null}
          </>
        }
        drawer={
          <AlarmRuleDrawer
            rule={data.selectedRule}
            scps={data.scpList}
            scpNameMap={data.scpNameMap}
            editor={editor}
          />
        }
      />
    </div>
  )
}
