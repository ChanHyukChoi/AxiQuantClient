import { useCallback, useEffect, useMemo, useState } from 'react'
import { MOCK_HOLIDAYS } from '@/pages/TimezoneHolidayPage/timezoneHolidayMockData'
import { useHolidayList } from '@/hooks/api/useHoliday'
import type { HolidayInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_TIMEZONE_HOLIDAY_MOCK === 'true'

export const useHolidaysData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mockItems, setMockItems] = useState<HolidayInfo[]>(MOCK_HOLIDAYS)

  const { data: list, isLoading, isError } = useHolidayList()

  const useMock =
    forceMock || (import.meta.env.DEV && !isLoading && (isError || list === null))

  const items: HolidayInfo[] = useMock ? mockItems : (list ?? [])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return items
    const q = searchQuery.trim().toLowerCase()
    return items.filter(
      (h) => h.name.toLowerCase().includes(q) || h.date.toLowerCase().includes(q),
    )
  }, [items, searchQuery])

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null)
      return
    }
    if (selectedId == null || !filtered.some((h) => h.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filtered, selectedId])

  const selectedItem = useMemo(
    () => items.find((h) => h.id === selectedId) ?? null,
    [items, selectedId],
  )

  const selectItem = useCallback((item: HolidayInfo) => {
    setSelectedId(item.id)
  }, [])

  const patchMockItem = useCallback((id: number, patch: Partial<HolidayInfo>) => {
    setMockItems((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)))
  }, [])

  const addMockItem = useCallback((): number => {
    const newId = Math.max(0, ...mockItems.map((h) => h.id)) + 1
    const created: HolidayInfo = {
      id: newId,
      name: '새 휴일',
      date: '01-01',
      isRecurring: true,
    }
    setMockItems((prev) => [...prev, created])
    setSelectedId(newId)
    return newId
  }, [mockItems])

  const removeMockItem = useCallback((id: number) => {
    setMockItems((prev) => prev.filter((h) => h.id !== id))
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
