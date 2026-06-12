import { useCallback, useEffect, useState } from 'react'
import { UserCog } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import {
  SPLIT_DRAWER_DEFAULT_WIDTH,
  SPLIT_DRAWER_MIN_WIDTH,
} from '@/lib/layout/splitDrawerDefaults'
import { UserDrawer } from '@/pages/UsersPage/UserDrawer'
import { useUserColumns } from '@/pages/UsersPage/useUserColumns'
import { useUserEditor } from '@/pages/UsersPage/useUserEditor'
import { useUsersData } from '@/pages/UsersPage/useUsersData'
import type { UserInfo } from '@/types/api/user'

const USERS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.users.v1'

export const UsersPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const data = useUsersData()

  const editor = useUserEditor({
    user: data.selectedUser,
    useMock: data.useMock,
    patchMockUser: data.patchMockUser,
    addMockUser: data.addMockUser,
    removeMockUser: data.removeMockUser,
    onDeleted: data.onUserDeleted,
  })

  const displayUser = editor.isCreating ? null : data.selectedUser

  useEffect(() => {
    setPage(1)
  }, [data.searchQuery, data.filtered.length])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const handleRowClick = (row: UserInfo) => {
    editor.setIsCreating(false)
    data.selectUser(row)
  }

  const baseColumns = useUserColumns()
  const { columns, minGridWidth, setColumnWidth, moveColumn } = useGridLayout(baseColumns, {
    storageKey: USERS_GRID_LAYOUT_KEY,
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="사용자"
        icon={<UserCog size={15} />}
        actions={<AddButton onClick={editor.handleAdd} />}
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={SPLIT_DRAWER_MIN_WIDTH}
        defaultDrawerWidth={SPLIT_DRAWER_DEFAULT_WIDTH}
        storageKey="axiquant.drawer.users"
        main={
          <Grid
            columns={columns}
            data={data.filtered}
            selectedId={editor.isCreating ? undefined : (data.selectedId ?? undefined)}
            onRowClick={handleRowClick}
            searchPlaceholder="명칭, 로그인 ID 검색..."
            onSearch={data.setSearchQuery}
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
        }
        drawer={<UserDrawer user={displayUser} editor={editor} />}
      />
    </div>
  )
}
