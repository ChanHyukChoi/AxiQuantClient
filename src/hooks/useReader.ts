import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReader, deleteReader, getReaderList, updateReader } from '@/api/reader'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateReaderRequest, UpdateReaderRequest } from '@/types/api'

export const useReaderList = (scpId: number) =>
  useQuery({
    queryKey: queryKeys.reader.all(scpId),
    queryFn: () => getReaderList(scpId),
    enabled: scpId > 0,
  })

export const useCreateReader = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReaderRequest) => createReader(scpId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.reader.all(scpId) }),
  })
}

export const useUpdateReader = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReaderRequest }) =>
      updateReader(scpId, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.reader.all(scpId) }),
  })
}

export const useDeleteReader = (scpId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteReader(scpId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.reader.all(scpId) }),
  })
}
