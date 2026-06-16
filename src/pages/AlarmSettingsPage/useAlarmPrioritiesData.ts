import { useCallback, useMemo, useState } from 'react'
import {
  DEFAULT_ALARM_PRIORITY_EXTRA,
  type AlarmPriorityDisplay,
} from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useAlarmPriorities } from '@/hooks/api/useAlarmSettings'
import type { AlarmPriorityInfo } from '@/types/api'

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

  const { data: list, isLoading, isError } = useAlarmPriorities()

  const items: AlarmPriorityDisplay[] = (list ?? []).map(priorityToDisplay)

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.priority - b.priority),
    [items],
  )

  const selectedItem = useMemo(
    () => items.find((p) => p.id === selectedId) ?? null,
    [items, selectedId],
  )

  const selectItem = useCallback((item: AlarmPriorityDisplay) => {
    setSelectedId(item.id)
  }, [])

  const onItemDeleted = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    items: sortedItems,
    selectedId,
    selectedItem,
    selectItem,
    isLoading,
    isError: isError || list === null,
    onItemDeleted,
  }
}
