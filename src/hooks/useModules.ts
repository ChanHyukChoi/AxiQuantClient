import { useQuery } from '@tanstack/react-query'
import { getModuleList } from '@/api/modules'
import { queryKeys } from '@/lib/queryKeys'

export const useModuleList = () =>
  useQuery({ queryKey: queryKeys.modules.all, queryFn: getModuleList })
