import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cpu } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { ScpCreateModal } from '@/pages/ControllersPage/components/ScpCreateModal'
import { ScpDetailPanel } from '@/pages/ControllersPage/components/ScpDetailPanel'
import { useScpColumns } from '@/pages/ControllersPage/useScpColumns'
import { useControllersData } from '@/pages/ControllersPage/useControllersData'
import { getScpList } from '@/api/scp'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateScpRequest, ScpInfo } from '@/types/api'

const CONTROLLERS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.controllers.v1'

export const ControllersPage = () => {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const {
    useMock,
    filteredScps,
    selectedId,
    selectedScp,
    sios,
    siosLoading,
    setSearchQuery,
    selectScp,
    isLoading,
    isError,
    patchMockScp,
    addMockScp,
    removeMockScp,
    patchMockSio,
    addMockSio,
    removeMockSio,
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
    selectScp(row)
  }

  const handleCreated = useCallback(
    async (data: CreateScpRequest) => {
      setCreateOpen(false)
      if (useMock) {
        addMockScp(data)
        return
      }
      const list = await qc.fetchQuery({
        queryKey: queryKeys.deviceControl.scps(),
        queryFn: getScpList,
      })
      const created = list?.find((s) => s.name === data.name)
      if (created) selectScp(created)
    },
    [useMock, addMockScp, qc, selectScp],
  )

  const baseColumns = useScpColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: CONTROLLERS_GRID_LAYOUT_KEY,
  })

  const gridData = useMemo(() => filteredScps, [filteredScps])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="제어기"
        icon={<Cpu size={15} />}
        actions={<AddButton onClick={() => setCreateOpen(true)} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.controllers"
        main={
          <>
            <Grid
              columns={columns}
              data={gridData}
              selectedId={selectedId ?? undefined}
              onRowClick={handleRowClick}
              onSearch={setSearchQuery}
              searchPlaceholder="제어기 검색..."
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
                제어기 목록을 불러오지 못했습니다.
              </p>
            ) : null}
          </>
        }
        drawer={
          <ScpDetailPanel
            scp={selectedScp}
            sios={sios}
            siosLoading={siosLoading}
            useMock={useMock}
            patchMockScp={patchMockScp}
            removeMockScp={removeMockScp}
            patchMockSio={patchMockSio}
            addMockSio={addMockSio}
            removeMockSio={removeMockSio}
            onDeleted={onScpDeleted}
          />
        }
      />

      <ScpCreateModal
        open={createOpen}
        useMock={useMock}
        onCancel={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
