import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Cpu } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/patterns/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { ScpDrawer } from '@/pages/ControllersPage/ScpDrawer'
import { useScpColumns } from '@/pages/ControllersPage/useScpColumns'
import { useControllersData } from '@/pages/ControllersPage/useControllersData'
import { fetchScpList } from '@/hooks/api/queryCache'
import type { CreateScpRequest, ScpInfo } from '@/types/api'

const CONTROLLERS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.controllers.v1'

export const ControllersPage = () => {
  const { t } = useTranslation(['nav', 'device'])
  const qc = useQueryClient()
  const selectionBeforeCreateRef = useRef<number | null>(null)
  const [createMode, setCreateMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const {
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading,
    setSearchQuery,
    selectScp,
    isLoading,
    isError,
    onScpDeleted,
  } = useControllersData()

  useEffect(() => {
    setPage(1)
  }, [filteredScps.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: ScpInfo) => {
    if (createMode) {
      setCreateMode(false)
      selectionBeforeCreateRef.current = null
    }
    selectScp(row)
  }

  const handleAddClick = () => {
    selectionBeforeCreateRef.current = selectedId
    setCreateMode(true)
    selectScp(null)
  }

  const handleCreateCancel = () => {
    setCreateMode(false)
    selectScp(selectionBeforeCreateRef.current)
    selectionBeforeCreateRef.current = null
  }

  const handleCreated = useCallback(
    async (data: CreateScpRequest) => {
      setCreateMode(false)
      selectionBeforeCreateRef.current = null
      const list = await fetchScpList(qc)
      const created = list?.find((s) => s.name === data.name)
      if (created) selectScp(created.id)
    },
    [qc, selectScp],
  )

  const baseColumns = useScpColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: CONTROLLERS_GRID_LAYOUT_KEY,
  })

  const gridData = useMemo(() => filteredScps, [filteredScps])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.controllers')}
        icon={<Cpu size={15} />}
        actions={<AddButton onClick={handleAddClick} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <>
            <Grid
              columns={columns}
              data={gridData}
              selectedId={selectedId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={setSearchQuery}
              searchPlaceholder={t('device:scp.searchPlaceholder')}
              totalCount={filteredScps.length}
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
                {t('device:scp.loadError')}
              </p>
            ) : null}
          </>
        }
        drawer={
          <ScpDrawer
            scp={selectedScp}
            createMode={createMode}
            sios={sios}
            siosLoading={siosLoading}
            onCreateCancel={handleCreateCancel}
            onCreated={handleCreated}
            onDeleted={onScpDeleted}
          />
        }
      />
    </div>
  )
}
