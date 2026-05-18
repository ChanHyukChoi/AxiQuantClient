import { axiosInstance } from '@/lib/axios'
import { parseAuditPaged } from '@/lib/auditMappers'
import type { AuditLogParams, PagedAuditLogResponse } from '@/types/api/audit'

export const getAuditLog = async (params: AuditLogParams): Promise<PagedAuditLogResponse> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/audit-log', { params })
    return parseAuditPaged(data)
  } catch {
    return { items: [], total: 0 }
  }
}
