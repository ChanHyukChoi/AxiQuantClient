import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createScp, deleteScp, getScpList, updateScp } from '@/api/scp'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateScpRequest, UpdateScpRequest } from '@/types/api'

export const useScpList = () =>
  useQuery({ queryKey: queryKeys.scp.all, queryFn: getScpList })

export const useCreateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateScpRequest) => createScp(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.scp.all }),
  })
}

export const useUpdateScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScpRequest }) => updateScp(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.scp.all }),
  })
}

export const useDeleteScp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteScp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.scp.all }),
  })
}
