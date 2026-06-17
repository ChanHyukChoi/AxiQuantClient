import { useQuery } from '@tanstack/react-query'
import { getLicenseInfo } from '@/api/system'
import { queryKeys } from '@/lib/query/queryKeys'

export const useLicenseInfo = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.system.license(),
    queryFn: getLicenseInfo,
    enabled,
    refetchInterval: 60_000,
    retry: false,
  })
