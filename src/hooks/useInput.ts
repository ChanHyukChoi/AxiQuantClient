import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createInput, deleteInput, getInputList, updateInput } from '@/api/input'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateInputRequest, UpdateInputRequest } from '@/types/api'

export const useInputList = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.input.all(scpId),
    queryFn: () => getInputList(scpId),
    enabled: scpId > 0,
  })

export const useCreateInput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInputRequest) => createInput(scpId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.input.all(scpId) }),
  })
}

export const useUpdateInput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInputRequest }) =>
      updateInput(scpId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.input.all(scpId) }),
  })
}

export const useDeleteInput = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteInput(scpId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.input.all(scpId) }),
  })
}
