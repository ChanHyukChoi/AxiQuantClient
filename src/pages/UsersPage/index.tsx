import { UserCog } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { UserDrawer } from '@/pages/UsersPage/UserDrawer'
import { UserListPane } from '@/pages/UsersPage/UserListPane'
import { useUserEditor } from '@/pages/UsersPage/useUserEditor'
import { useUsersData } from '@/pages/UsersPage/useUsersData'

export const UsersPage = () => {
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="사용자"
        icon={<UserCog size={15} />}
        variantPaths={{ a: '/users', b: '/users-b' }}
        actions={<AddButton onClick={editor.handleAdd} />}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <UserListPane
          users={data.filtered}
          selectedId={editor.isCreating ? null : data.selectedId}
          searchQuery={data.searchQuery}
          loading={data.isLoading}
          error={data.isError}
          onSearch={data.setSearchQuery}
          onSelect={(user) => {
            editor.setIsCreating(false)
            data.selectUser(user)
          }}
        />
        <UserDrawer user={displayUser} editor={editor} />
      </div>
    </div>
  )
}
