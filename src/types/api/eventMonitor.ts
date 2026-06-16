import type { DeviceEventMessage } from './sse'

export type EventMonitorType = 'access' | 'alarm'

export interface EventRecord {
  id: number
  type: EventMonitorType
  event: string
  card: string
  user: string
  ctrl: string
  device: string
  direction: string
  ts: string
  occurredAt: Date
  acked: boolean
  raw: DeviceEventMessage
}

export interface AccessLogParams {
  startAt: string
  endAt: string
  eventType?: string
  cardNo?: string
  scpId?: number
  deviceId?: string
  page: number
  pageSize: number
}

export interface AlarmLogParams {
  startAt: string
  endAt: string
  eventType?: string
  cardNo?: string
  scpId?: number
  deviceId?: string
  page: number
  pageSize: number
}

export interface AccessLogItem {
  id: number
  eventType: string
  cardNo: string
  empName: string
  scpId: number
  scpName: string
  deviceId: string
  deviceName: string
  direction: string
  occurredAt: string
}

export interface AlarmLogItem {
  id: number
  eventType: string
  cardNo: string
  empName: string
  scpId: number
  scpName: string
  deviceId: string
  deviceName: string
  direction: string
  occurredAt: string
  acked: boolean
}

export interface PagedLogResponse<T> {
  items: T[]
  total: number
}
