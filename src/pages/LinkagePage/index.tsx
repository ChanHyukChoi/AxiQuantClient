import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link2 } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton, ExportButton, ImportButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { LinkageDrawer } from '@/pages/LinkagePage/LinkageDrawer'
import { toLinkageGridRows, useLinkageColumns } from '@/pages/LinkagePage/useLinkageColumns'
import { useLinkageData } from '@/pages/LinkagePage/useLinkageData'

const LINKAGE_GRID_LAYOUT_KEY = 'axiquant.grid.layout.linkage.v1'

export const LinkagePage = () => {
  const { t } = useTranslation(['nav', 'linkage'])
  const [editMode, setEditMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { rules, selectedId, selectedRule, setSearchQuery, selectRule } = useLinkageData()

  const gridData = useMemo(() => toLinkageGridRows(rules), [rules])

  useEffect(() => {
    setPage(1)
  }, [rules.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const baseColumns = useLinkageColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: LINKAGE_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.linkage')}
        icon={<Link2 size={15} />}
        actions={
          <>
            <ImportButton size="sm" showLabel={false} onClick={() => undefined} />
            <ExportButton size="sm" showLabel={false} onClick={() => undefined} />
            <AddButton onClick={() => undefined} />
          </>
        }
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.linkage"
        main={
          <Grid
            columns={columns}
            data={gridData}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => {
              if (editMode) setEditMode(false)
              selectRule(row.id)
            }}
            onSearch={setSearchQuery}
            searchPlaceholder={t('linkage:searchPlaceholder')}
            totalCount={rules.length}
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
        }
        drawer={<LinkageDrawer rule={selectedRule} onEditModeChange={setEditMode} />}
      />
    </div>
  )
}
