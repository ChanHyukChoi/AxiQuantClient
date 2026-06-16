import { useCallback, useMemo, useState } from 'react'
import { useUsers } from '@/hooks/api/useUsers'
import type { UserInfo } from '@/types/api/user'

export const useUsersData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: users, isLoading, isError } = useUsers()
  const list = users ?? []

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.loginId.toLowerCase().includes(q),
    )
  }, [list, searchQuery])

  const selectedUser = useMemo(
    () => list.find((u) => u.id === selectedId) ?? null,
    [list, selectedId],
  )

  const selectUser = useCallback((user: UserInfo) => {
    setSelectedId(user.id)
  }, [])

  const onUserDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    users: list,
    filtered,
    selectedId,
    selectedUser,
    searchQuery,
    setSearchQuery,
    selectUser,
    isLoading,
    isError,
    onUserDeleted,
  }
}
