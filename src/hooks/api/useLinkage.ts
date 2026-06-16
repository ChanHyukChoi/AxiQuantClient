import { useQuery } from '@tanstack/react-query'
import { getLinkageList } from '@/api/linkage'
import { queryKeys } from '@/lib/query/queryKeys'

export const useLinkageList = () =>
  useQuery({ queryKey: queryKeys.linkage.all(), queryFn: getLinkageList })
