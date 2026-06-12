import { axiosInstance } from '@/lib/infra/axios'
import { isApiNotReady } from '@/lib/wire/apiErrors'
import { parseAuditPaged } from '@/lib/mappers/auditMappers'
import { getMockAuditLog, shouldUseAuditMock } from '@/pages/AuditLogPage/auditMockData'
import type { AuditLogParams, PagedAuditLogResponse } from '@/types/api/audit'

export type AuditLogResult = PagedAuditLogResponse & { apiNotReady?: boolean }

export const getAuditLog = async (params: AuditLogParams): Promise<AuditLogResult> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/audit-log', { params })
    const result = parseAuditPaged(data)
    if (shouldUseAuditMock(result)) return getMockAuditLog(params)
    return result
  } catch (error) {
    const fallback: AuditLogResult = isApiNotReady(error)
      ? { items: [], total: 0, apiNotReady: true }
      : { items: [], total: 0 }
    if (shouldUseAuditMock(fallback)) return getMockAuditLog(params)
    return fallback
  }
}
