import { useCallback, useMemo } from 'react'
import { useHolidayList } from '@/hooks/api/useHoliday'
import type { HolidayInfo } from '@/types/api'

export const useScheduleHolidays = () => {
  const { data: list, isLoading } = useHolidayList()
  const allItems: HolidayInfo[] = list ?? []

  const itemsByTimezone = useCallback(
    (timezoneId: number) => allItems.filter((h) => h.timezoneId === timezoneId),
    [allItems],
  )

  return useMemo(
    () => ({
      allItems,
      itemsByTimezone,
      isLoading,
    }),
    [allItems, itemsByTimezone, isLoading],
  )
}

export type ScheduleHolidaysApi = ReturnType<typeof useScheduleHolidays>
