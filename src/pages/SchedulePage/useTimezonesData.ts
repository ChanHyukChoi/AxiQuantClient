import { useCallback, useMemo, useState } from 'react'
import { timezoneDisplayName } from '@/pages/SchedulePage/utils/timezoneDisplay'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { TimezoneInfo } from '@/types/api'

export const useTimezonesData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: list, isLoading, isError } = useTimezoneList()
  const items: TimezoneInfo[] = list ?? []

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.trim().toLowerCase()
    return items.filter((t) => timezoneDisplayName(t).toLowerCase().includes(q))
  }, [items, searchQuery])

  const selectedItem = useMemo(
    () => items.find((t) => t.id === selectedId) ?? null,
    [items, selectedId],
  )

  const selectItem = useCallback((item: TimezoneInfo) => {
    setSelectedId(item.id)
  }, [])

  const onItemDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    items,
    filtered,
    selectedId,
    selectedItem,
    searchQuery,
    setSearchQuery,
    selectItem,
    isLoading,
    isError: isError || list === null,
    onItemDeleted,
  }
}
