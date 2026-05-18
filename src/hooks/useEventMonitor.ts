import { useQuery } from '@tanstack/react-query'
import { getAccessLog, getAlarmLog } from '@/api/eventMonitor'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AccessLogParams, AlarmLogParams } from '@/types/api/eventMonitor'

export const useAccessLog = (params: AccessLogParams, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.eventMonitor.accessLog(params),
    queryFn: () => getAccessLog(params),
    enabled,
  })

export const useAlarmLog = (params: AlarmLogParams, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.eventMonitor.alarmLog(params),
    queryFn: () => getAlarmLog(params),
    enabled,
  })
