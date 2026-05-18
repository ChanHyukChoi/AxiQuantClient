import { firstNumber } from '@/lib/wireJson'
import type {
  AccessLogItem,
  AlarmLogItem,
  EventMonitorType,
  EventRecord,
} from '@/types/api/eventMonitor'
import type { DeviceEventMessage } from '@/types/api/sse'

const DOTNET_EPOCH_TICKS = 621_355_968_000_000_000n

let liveSeq = 0

export const nextEventId = (): number => {
  liveSeq += 1
  return liveSeq
}

export const resetLiveEventSeq = (): void => {
  liveSeq = 0
}

const ticksToDate = (ticks: number): Date => {
  if (!Number.isFinite(ticks) || ticks <= 0) return new Date()
  try {
    const ms = Number((BigInt(Math.trunc(ticks)) - DOTNET_EPOCH_TICKS) / 10_000n)
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? new Date() : d
  } catch {
    return new Date()
  }
}

const isoToDate = (iso: string): Date => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export const formatEventTs = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const parsePayload = (json: string): Record<string, unknown> => {
  if (!json.trim()) return {}
  try {
    const v = JSON.parse(json) as unknown
    return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

const strField = (row: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

const inferMonitorType = (eventType: string, sourceModule: string): EventMonitorType => {
  const t = `${eventType} ${sourceModule}`.toLowerCase()
  if (t.includes('alarm') || t.includes('경보')) return 'alarm'
  return 'access'
}

export const deviceEventToRecord = (msg: DeviceEventMessage, id?: number): EventRecord => {
  const payload = parsePayload(msg.payloadJson)
  const occurredAt = ticksToDate(msg.occurredAtUtcTicks)
  const type = inferMonitorType(msg.eventType, msg.sourceModule)

  return {
    id: id ?? nextEventId(),
    type,
    event: strField(payload, ['event', 'eventName', 'eventType']) || msg.eventType,
    card: strField(payload, ['card', 'cardNo', 'cardNumber']),
    user: strField(payload, ['user', 'empName', 'employeeName', 'name']),
    ctrl: strField(payload, ['ctrl', 'scpName', 'controller']),
    device: strField(payload, ['device', 'deviceName']) || msg.deviceId,
    direction: strField(payload, ['direction', 'dir']),
    ts: formatEventTs(occurredAt),
    occurredAt,
    acked: type === 'alarm' ? Boolean(payload.acked ?? payload.isAcked) : false,
    raw: msg,
  }
}

const logItemToRecord = (
  item: AccessLogItem | AlarmLogItem,
  type: EventMonitorType,
): EventRecord => {
  const occurredAt = isoToDate(item.occurredAt)
  const acked = type === 'alarm' && 'acked' in item ? item.acked : false

  return {
    id: item.id,
    type,
    event: item.eventType,
    card: item.cardNo,
    user: item.empName,
    ctrl: item.scpName,
    device: item.deviceName || item.deviceId,
    direction: item.direction,
    ts: formatEventTs(occurredAt),
    occurredAt,
    acked,
    raw: {
      sourceModule: type === 'alarm' ? 'alarm' : 'access',
      deviceId: item.deviceId,
      eventType: item.eventType,
      payloadJson: JSON.stringify(item),
      occurredAtUtcTicks: 0,
    },
  }
}

export const accessLogToRecord = (item: AccessLogItem): EventRecord =>
  logItemToRecord(item, 'access')

export const alarmLogToRecord = (item: AlarmLogItem): EventRecord =>
  logItemToRecord(item, 'alarm')

export const wireToAccessLogItem = (row: Record<string, unknown>, index: number): AccessLogItem => ({
  id: firstNumber(row, ['id', 'logId']) || index + 1,
  eventType: strField(row, ['eventType', 'event', 'eventName']),
  cardNo: strField(row, ['cardNo', 'card', 'cardNumber']),
  empName: strField(row, ['empName', 'user', 'employeeName', 'name']),
  scpId: firstNumber(row, ['scpId', 'controllerId']),
  scpName: strField(row, ['scpName', 'ctrl', 'controller']),
  deviceId: strField(row, ['deviceId', 'device']),
  deviceName: strField(row, ['deviceName', 'device']),
  direction: strField(row, ['direction', 'dir']),
  occurredAt: strField(row, ['occurredAt', 'timestamp', 'ts']) || new Date().toISOString(),
})

export const wireToAlarmLogItem = (row: Record<string, unknown>, index: number): AlarmLogItem => ({
  ...wireToAccessLogItem(row, index),
  acked: Boolean(row.acked ?? row.isAcked),
})
