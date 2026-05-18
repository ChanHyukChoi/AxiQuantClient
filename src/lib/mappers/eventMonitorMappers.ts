import { firstNumber } from '@/lib/wire/wireJson'
import type { AccessLogItem, AlarmLogItem } from '@/types/api/eventMonitor'

const strField = (row: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

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
