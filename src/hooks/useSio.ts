import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSio, deleteSio, getSioList, updateSio } from '@/api/sio'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateSioRequest, UpdateSioRequest } from '@/types/api'

export const useSioList = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.sio.all(scpId),
    queryFn: () => getSioList(scpId),
    enabled: scpId > 0,
  })

export const useCreateSio = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSioRequest) => createSio(scpId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sio.all(scpId) }),
  })
}

export const useUpdateSio = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSioRequest }) =>
      updateSio(scpId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sio.all(scpId) }),
  })
}

export const useDeleteSio = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSio(scpId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sio.all(scpId) }),
  })
}
