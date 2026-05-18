import { useMemo } from 'react'
import { accessLogToRecord, alarmLogToRecord } from '@/lib/eventMonitorMappers'
import { useAccessLog, useAlarmLog } from '@/hooks/useEventMonitor'
import type { AccessLogParams, AlarmLogParams, EventRecord } from '@/types/api/eventMonitor'

export type HistoryTypeFilter = 'all' | 'access' | 'alarm'

interface UseHistoryEventsOptions {
  typeFilter: HistoryTypeFilter
  accessParams: AccessLogParams
  alarmParams: AlarmLogParams
  searchQuery: string
  enabled: boolean
}

const matchesSearch = (row: EventRecord, q: string): boolean => {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay = [row.event, row.card, row.user, row.device, row.ctrl].join(' ').toLowerCase()
  return hay.includes(needle)
}

export const useHistoryEvents = ({
  typeFilter,
  accessParams,
  alarmParams,
  searchQuery,
  enabled,
}: UseHistoryEventsOptions) => {
  const accessEnabled = enabled && (typeFilter === 'all' || typeFilter === 'access')
  const alarmEnabled = enabled && (typeFilter === 'all' || typeFilter === 'alarm')

  const accessQuery = useAccessLog(accessParams, accessEnabled)
  const alarmQuery = useAlarmLog(alarmParams, alarmEnabled)

  const events = useMemo(() => {
    const accessRows = (accessQuery.data?.items ?? []).map(accessLogToRecord)
    const alarmRows = (alarmQuery.data?.items ?? []).map(alarmLogToRecord)
    const merged = [...accessRows, ...alarmRows]
      .filter((row) => matchesSearch(row, searchQuery))
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    return merged
  }, [accessQuery.data, alarmQuery.data, searchQuery])

  const total = useMemo(() => {
    if (typeFilter === 'access') return accessQuery.data?.total ?? 0
    if (typeFilter === 'alarm') return alarmQuery.data?.total ?? 0
    return (accessQuery.data?.total ?? 0) + (alarmQuery.data?.total ?? 0)
  }, [typeFilter, accessQuery.data, alarmQuery.data])

  const isLoading =
    (accessEnabled && accessQuery.isLoading) || (alarmEnabled && alarmQuery.isLoading)
  const isError = (accessEnabled && accessQuery.isError) || (alarmEnabled && alarmQuery.isError)

  const apiNotReady =
    Boolean(accessQuery.data?.apiNotReady) || Boolean(alarmQuery.data?.apiNotReady)

  return {
    events,
    total,
    isLoading,
    isError,
    apiNotReady,
    refetch: () => {
      void accessQuery.refetch()
      void alarmQuery.refetch()
    },
  }
}
