import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOutput, deleteOutput, getOutputList, updateOutput } from '@/api/output'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateOutputRequest, UpdateOutputRequest } from '@/types/api'

export const useOutputList = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.output.all(scpId),
    queryFn: () => getOutputList(scpId),
    enabled: scpId > 0,
  })

export const useCreateOutput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOutputRequest) => createOutput(scpId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.output.all(scpId) }),
  })
}

export const useUpdateOutput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOutputRequest }) =>
      updateOutput(scpId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.output.all(scpId) }),
  })
}

export const useDeleteOutput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteOutput(scpId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.output.all(scpId) }),
  })
}
