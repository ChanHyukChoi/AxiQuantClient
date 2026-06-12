import { useCallback, useMemo, useState } from 'react'
import { MOCK_USERS } from '@/pages/UsersPage/usersMockData'
import { useUsers } from '@/hooks/api/useUsers'
import type { UserInfo } from '@/types/api/user'

const forceMock = import.meta.env.VITE_USERS_MOCK === 'true'

export const useUsersData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockUsers, setMockUsers] = useState<UserInfo[]>(MOCK_USERS)

  const { data: userResult, isLoading, isError } = useUsers()
  const apiNotReady = userResult?.apiNotReady ?? false

  const useMock =
    forceMock ||
    apiNotReady ||
    (import.meta.env.DEV && !isLoading && (isError || !userResult?.users?.length))

  const users: UserInfo[] = useMock ? mockUsers : (userResult?.users ?? [])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return users
    const q = searchQuery.trim().toLowerCase()
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.loginId.toLowerCase().includes(q),
    )
  }, [users, searchQuery])

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId) ?? null,
    [users, selectedId],
  )

  const selectUser = useCallback((user: UserInfo) => {
    setSelectedId(user.id)
  }, [])

  const patchMockUser = useCallback((id: number, patch: Partial<UserInfo>) => {
    setMockUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }, [])

  const addMockUser = useCallback((user: Omit<UserInfo, 'id'>): number => {
    const newId = Math.max(0, ...mockUsers.map((u) => u.id)) + 1
    setMockUsers((prev) => [...prev, { id: newId, ...user }])
    setSelectedId(newId)
    return newId
  }, [mockUsers])

  const removeMockUser = useCallback((id: number) => {
    setMockUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const onUserDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    useMock,
    users,
    filtered,
    selectedId,
    selectedUser,
    searchQuery,
    setSearchQuery,
    selectUser,
    isLoading: !useMock && isLoading,
    isError: !useMock && isError,
    patchMockUser,
    addMockUser,
    removeMockUser,
    onUserDeleted,
  }
}
