import { useCallback, useMemo, useState } from 'react'
import { MOCK_TIMEZONES } from '@/pages/TimezoneHolidayPage/timezoneHolidayMockData'
import { timezoneDisplayName } from '@/pages/TimezoneHolidayPage/utils/timezoneDisplay'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { TimezoneInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_TIMEZONE_HOLIDAY_MOCK === 'true'

export const useTimezonesData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockItems, setMockItems] = useState<TimezoneInfo[]>(MOCK_TIMEZONES)

  const { data: list, isLoading, isError } = useTimezoneList()

  const useMock =
    forceMock || (import.meta.env.DEV && !isLoading && (isError || list === null))

  const items: TimezoneInfo[] = useMock ? mockItems : (list ?? [])

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

  const patchMockItem = useCallback((id: number, patch: Partial<TimezoneInfo>) => {
    setMockItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const addMockItem = useCallback((): number => {
    const newId = Math.max(0, ...mockItems.map((t) => t.id)) + 1
    const created: TimezoneInfo = {
      id: newId,
      name: '새 타임존',
      intervals: [{ idx: 0, dmask: 127, hmask: 0, stm: '09:00', etm: '18:00' }],
      startTime: '09:00',
      endTime: '18:00',
      daysOfWeek: 127,
    }
    setMockItems((prev) => [...prev, created])
    setSelectedId(newId)
    return newId
  }, [mockItems])

  const removeMockItem = useCallback((id: number) => {
    setMockItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const onItemDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    useMock,
    items,
    filtered,
    selectedId,
    selectedItem,
    searchQuery,
    setSearchQuery,
    selectItem,
    isLoading,
    isError: isError || (!useMock && list === null),
    patchMockItem,
    addMockItem,
    removeMockItem,
    onItemDeleted,
  }
}
