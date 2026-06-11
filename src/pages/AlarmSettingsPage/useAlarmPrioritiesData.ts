import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_ALARM_PRIORITY_EXTRA,
  type AlarmPriorityDisplay,
} from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { MOCK_ALARM_PRIORITIES } from '@/pages/AlarmSettingsPage/alarmPriorityMockData'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useAlarmPriorities } from '@/hooks/api/useAlarmSettings'
import type { AlarmPriorityInfo } from '@/types/api'

const forceMock = import.meta.env.VITE_ALARM_PRIORITY_MOCK === 'true'

const priorityToDisplay = (item: AlarmPriorityInfo): AlarmPriorityDisplay => {
  const fg = normalizeHexColor(item.color)
  return {
    ...item,
    color: fg,
    ...DEFAULT_ALARM_PRIORITY_EXTRA,
    alarmFg: fg,
  }
}

export const useAlarmPrioritiesData = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [mockItems, setMockItems] = useState<AlarmPriorityDisplay[]>(MOCK_ALARM_PRIORITIES)

  const { data: list, isLoading, isError } = useAlarmPriorities()

  const useMock =
    forceMock || (import.meta.env.DEV && !isLoading && (isError || list === null))

  const items: AlarmPriorityDisplay[] = useMock
    ? mockItems
    : (list ?? []).map(priorityToDisplay)

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.priority - b.priority),
    [items],
  )

  useEffect(() => {
    if (sortedItems.length === 0) {
      setSelectedId(null)
      return
    }
    if (selectedId == null || !sortedItems.some((p) => p.id === selectedId)) {
      setSelectedId(sortedItems[0].id)
    }
  }, [sortedItems, selectedId])

  const selectedItem = useMemo(
    () => items.find((p) => p.id === selectedId) ?? null,
    [items, selectedId],
  )

  const selectItem = useCallback((item: AlarmPriorityDisplay) => {
    setSelectedId(item.id)
  }, [])

  const patchMockItem = useCallback((id: number, patch: Partial<AlarmPriorityDisplay>) => {
    setMockItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, ...patch }
        if (patch.alarmFg != null) next.color = normalizeHexColor(patch.alarmFg)
        return next
      }),
    )
  }, [])

  const addMockItem = useCallback((): number => {
    const maxPriority = mockItems.reduce((m, p) => Math.max(m, p.priority), 0)
    const nextPriority = Math.min(100, maxPriority + 10 || 10)
    const newId = Math.max(0, ...mockItems.map((p) => p.id)) + 1
    const created: AlarmPriorityDisplay = {
      id: newId,
      priority: nextPriority,
      color: '#4f9cf9',
      ...DEFAULT_ALARM_PRIORITY_EXTRA,
      alarmFg: '#4f9cf9',
    }
    setMockItems((prev) => [...prev, created])
    setSelectedId(newId)
    return newId
  }, [mockItems])

  const removeMockItem = useCallback((id: number) => {
    setMockItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const onItemDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    useMock,
    items: sortedItems,
    selectedId,
    selectedItem,
    selectItem,
    isLoading,
    isError: isError || (!useMock && list === null),
    patchMockItem,
    addMockItem,
    removeMockItem,
    onItemDeleted,
  }
}
