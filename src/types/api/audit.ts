export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ONLINE'
  | 'OFFLINE'
  | 'LOGIN_FAIL'

export interface AuditLogItem {
  id: number
  ts: string
  user: string
  clientType: string
  actionType: AuditActionType | string
  dataType: string
  controller: string
  data: string
}

export interface AuditLogParams {
  startAt: string
  endAt: string
  userId?: number
  actionType?: string
  dataType?: string
  page: number
  pageSize: number
}

export interface PagedAuditLogResponse {
  items: AuditLogItem[]
  total: number
}
