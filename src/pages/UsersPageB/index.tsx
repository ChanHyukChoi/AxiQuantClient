import { UserCog } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Modal } from '@/components/primitive/Modal'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import { UserEditorContent } from '@/pages/UsersPage/components/UserEditorContent'
import { useUserEditor } from '@/pages/UsersPage/useUserEditor'
import { useUsersData } from '@/pages/UsersPage/useUsersData'
import { fallbackUserName } from '@/lib/entityDisplayLabels'
import type { UserInfo } from '@/types/api/user'

const BASE_GRID_COLUMNS: ColumnDef<UserInfo>[] = [
  {
    key: 'loginId',
    header: '로그인 ID',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono truncate block" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 140,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackUserName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '활성',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
  {
    key: 'useExternalApi',
    header: '외부 API',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
]

export const UsersPageB = () => {
  const data = useUsersData()

  const editor = useUserEditor({
    user: data.selectedUser,
    useMock: data.useMock,
    patchMockUser: data.patchMockUser,
    addMockUser: data.addMockUser,
    removeMockUser: data.removeMockUser,
    onDeleted: data.onUserDeleted,
  })

  const { columns, layoutGridProps } = useGridColumnLayout(BASE_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.users-b',
  })

  const showEditor = editor.isCreating || data.selectedUser != null

  const titleLabel = editor.isCreating
    ? '사용자 추가'
    : data.selectedUser
      ? fallbackUserName(data.selectedUser.name)
      : ''

  const titleActions = showEditor ? (
    <CrudDetailActions
      editMode={editor.editMode || editor.isCreating}
      isSaving={editor.isSaving}
      isDeleting={editor.isDeleting}
      onEdit={editor.handleEdit}
      onDelete={() => editor.setDeleteOpen(true)}
      onSave={() => void editor.handleSave()}
      onCancel={editor.handleCancel}
    />
  ) : null

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="사용자"
        icon={<UserCog size={15} />}
        variantPaths={{ a: '/users', b: '/users-b' }}
        actions={<AddButton onClick={editor.handleAdd} />}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 42%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={columns}
            data={data.filtered}
            selectedId={editor.isCreating ? undefined : (data.selectedId ?? undefined)}
            onRowClick={(row) => {
              editor.setIsCreating(false)
              data.selectUser(row)
            }}
            onSearch={data.setSearchQuery}
            searchPlaceholder="명칭, 로그인 ID 검색..."
            totalCount={data.filtered.length}
            loading={data.isLoading}
            {...layoutGridProps}
          />
          {data.isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              사용자 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {showEditor ? (
            <>
            <DetailTitleBar
              icon={<UserCog size={14} style={{ color: 'var(--color-accent)' }} />}
              title={titleLabel}
              actions={titleActions}
            />
            {editor.saveError ? (
              <p className="text-[13px] px-3 py-1 text-right" style={{ color: '#c75c5c' }}>
                {editor.saveError}
              </p>
            ) : null}
            <UserEditorContent
              activeTab={editor.activeTab}
              editMode={editor.editMode}
              isCreating={editor.isCreating}
              register={editor.register}
              control={editor.control}
              values={editor.values}
              onToggleActive={() => editor.setValue('active', !editor.values.active)}
              onToggleExternalApi={() =>
                editor.setValue('useExternalApi', !editor.values.useExternalApi)
              }
              onPermissionsChange={(perms) => editor.setValue('permissions', perms)}
              layout="split"
            />
            </>
          ) : (
            <p
              className="text-[14px] p-4"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              상단 목록에서 사용자를 선택하세요.
            </p>
          )}
        </div>
      </div>

      <Modal
        open={editor.deleteOpen}
        title="사용자 삭제"
        description={
          data.selectedUser
            ? `"${data.selectedUser.name}" 사용자를 삭제하시겠습니까?`
            : ''
        }
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        loading={editor.isDeleting}
        onConfirm={() => void editor.handleDeleteConfirm()}
        onCancel={() => editor.setDeleteOpen(false)}
      />
    </div>
  )
}
