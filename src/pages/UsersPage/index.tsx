import { useMemo, useState } from 'react'
import { Plus, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserDrawer } from '@/pages/UsersPage/UserDrawer'
import { UserListPane } from '@/pages/UsersPage/UserListPane'
import { useUsers } from '@/hooks/useUsers'
import type { UserInfo } from '@/types/api/user'

export const UsersPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { data: userList, isLoading, isError } = useUsers()

  const filteredUsers = useMemo(() => {
    const list = userList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.loginId.toLowerCase().includes(q) ||
        String(u.id).includes(q),
    )
  }, [userList, searchQuery])

  const selectedUser = useMemo(() => {
    if (isCreating) return null
    return (userList ?? []).find((u) => u.id === selectedId) ?? null
  }, [userList, selectedId, isCreating])

  const handleSelect = (user: UserInfo) => {
    setIsCreating(false)
    setSelectedId(user.id)
  }

  const handleAdd = () => {
    setSelectedId(null)
    setIsCreating(true)
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
  }

  const handleCreated = () => {
    setIsCreating(false)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <UserCog style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            사용자
          </span>
        </div>
        <Button size="sm" variant="accent" leftIcon={<Plus size={14} />} onClick={handleAdd}>
          추가
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <UserListPane
          users={filteredUsers}
          selectedId={isCreating ? null : selectedId}
          searchQuery={searchQuery}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onSelect={handleSelect}
        />
        <UserDrawer
          user={selectedUser}
          isCreating={isCreating}
          onCreated={handleCreated}
          onCancelCreate={handleCancelCreate}
        />
      </div>
    </div>
  )
}
