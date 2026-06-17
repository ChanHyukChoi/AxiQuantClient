import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { DoorOpen } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/patterns/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { AccessDrawer } from '@/pages/AccessPage/AccessDrawer'
import { useAccLvColumns } from '@/pages/AccessPage/useAccLvColumns'
import { CreateAccLvModal } from '@/pages/AccessPage/components/CreateAccLvModal'
import { fetchAccLvList } from '@/hooks/api/queryCache'
import { useAccLvList } from '@/hooks/api/useAccLv'
import type { AccLvInfo } from '@/types/api'

const ACCESS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.access.v1'

export const AccessPage = () => {
  const { t } = useTranslation(['nav', 'access'])
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data: accLvList, isLoading: accLvLoading } = useAccLvList()

  const selectedAccLv = useMemo(
    () => accLvList?.find((a) => a.id === selectedId) ?? null,
    [accLvList, selectedId],
  )

  const filteredList = useMemo(() => {
    if (!accLvList) return []
    if (!searchQuery.trim()) return accLvList
    const q = searchQuery.toLowerCase()
    return accLvList.filter((a) => a.name.toLowerCase().includes(q))
  }, [accLvList, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, filteredList.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: AccLvInfo) => {
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
  }

  const handleCreated = useCallback(
    async (name: string) => {
      setCreateOpen(false)
      const list = await fetchAccLvList(qc)
      const created = list?.find((a) => a.name === name)
      if (created) setSelectedId(created.id)
    },
    [qc],
  )

  const baseColumns = useAccLvColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: ACCESS_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('menu.access')}
        icon={<DoorOpen size={15} />}
        actions={<AddButton onClick={() => setCreateOpen(true)} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <Grid
            columns={columns}
            data={filteredList}
            selectedId={selectedId ?? undefined}
            onRowClick={handleRowClick}
            searchPlaceholder={t('access:searchPlaceholder')}
            onSearch={setSearchQuery}
            totalCount={filteredList.length}
            loading={accLvLoading}
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
        drawer={
          <AccessDrawer
            accLv={selectedAccLv}
            onDeleted={() => setSelectedId(null)}
            onEditModeChange={setEditMode}
          />
        }
      />

      <CreateAccLvModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
