import { asRecordArray, firstNumber } from '@/lib/wire/wireJson'
import type { AuditActionType, AuditLogItem, PagedAuditLogResponse } from '@/types/api/audit'

const str = (row: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

const actionTypes: AuditActionType[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ONLINE',
  'OFFLINE',
  'LOGIN_FAIL',
]

const parseActionType = (v: string): AuditActionType | string => {
  const u = v.toUpperCase()
  return actionTypes.includes(u as AuditActionType) ? (u as AuditActionType) : v
}

export const wireToAuditLogItem = (row: Record<string, unknown>, index: number): AuditLogItem => ({
  id: firstNumber(row, ['id', 'logId']) || index + 1,
  ts: str(row, ['ts', 'timestamp', 'occurredAt', 'createdAt']),
  user: str(row, ['user', 'userName', 'operator']),
  clientType: str(row, ['clientType', 'client']),
  actionType: parseActionType(str(row, ['actionType', 'action'])),
  dataType: str(row, ['dataType', 'type']),
  controller: str(row, ['controller', 'ctrl', 'scpName']),
  data: str(row, ['data', 'detail', 'payload']),
})

export const parseAuditPaged = (data: unknown): PagedAuditLogResponse => {
  if (data == null) return { items: [], total: 0 }

  if (Array.isArray(data)) {
    const items = asRecordArray(data).map(wireToAuditLogItem)
    return { items, total: items.length }
  }

  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    const rows = asRecordArray(o.items ?? o.data ?? o.results ?? o.logs)
    const items = rows.map(wireToAuditLogItem)
    const total = firstNumber(o, ['total', 'totalCount', 'count']) || items.length
    return { items, total }
  }

  return { items: [], total: 0 }
}
