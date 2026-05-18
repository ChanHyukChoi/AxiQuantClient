import { useQuery } from '@tanstack/react-query'
import { getAuditLog } from '@/api/audit'
import { queryKeys } from '@/lib/queryKeys'
import type { AuditLogParams } from '@/types/api/audit'

export const useAuditLog = (params: AuditLogParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.auditLog.list(params),
    queryFn: () => getAuditLog(params),
    enabled,
  })
