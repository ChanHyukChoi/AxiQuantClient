import { axiosInstance } from '@/lib/infra/axios'
import { asRecordArray, firstNumber } from '@/lib/wire/wireJson'
import { wireToAccessLogItem, wireToAlarmLogItem } from '@/lib/mappers/eventMonitorMappers'
import type {
  AccessLogParams,
  AlarmLogParams,
  PagedLogResponse,
  AccessLogItem,
  AlarmLogItem,
} from '@/types/api/eventMonitor'

const emptyPaged = <T>(): PagedLogResponse<T> => ({
  items: [],
  total: 0,
})

const parsePaged = <T>(
  data: unknown,
  mapItem: (row: Record<string, unknown>, index: number) => T,
): PagedLogResponse<T> => {
  if (data == null) return emptyPaged()

  if (Array.isArray(data)) {
    const items = asRecordArray(data).map(mapItem)
    return { items, total: items.length }
  }

  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    const rows = asRecordArray(o.items ?? o.data ?? o.results ?? o.logs)
    const items = rows.map(mapItem)
    const total = firstNumber(o, ['total', 'totalCount', 'count']) || items.length
    return { items, total }
  }

  return emptyPaged()
}

export const getAccessLog = async (
  params: AccessLogParams,
): Promise<PagedLogResponse<AccessLogItem>> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/access-log', { params })
    return parsePaged(data, wireToAccessLogItem)
  } catch {
    return emptyPaged()
  }
}

export const getAlarmLog = async (
  params: AlarmLogParams,
): Promise<PagedLogResponse<AlarmLogItem>> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/alarm-log', { params })
    return parsePaged(data, wireToAlarmLogItem)
  } catch {
    return emptyPaged()
  }
}
