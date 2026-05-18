import { axiosInstance } from '@/lib/infra/axios'
import { isApiNotReady } from '@/lib/wire/apiErrors'
import { parseAuditPaged } from '@/lib/mappers/auditMappers'
import type { AuditLogParams, PagedAuditLogResponse } from '@/types/api/audit'

export type AuditLogResult = PagedAuditLogResponse & { apiNotReady?: boolean }

export const getAuditLog = async (params: AuditLogParams): Promise<AuditLogResult> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/audit-log', { params })
    return parseAuditPaged(data)
  } catch (error) {
    if (isApiNotReady(error)) return { items: [], total: 0, apiNotReady: true }
    return { items: [], total: 0 }
  }
}
