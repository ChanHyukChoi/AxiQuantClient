import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAccLvReader,
  createAccLv,
  deleteAccLv,
  deleteAccLvReader,
  getAccLvList,
  getAccLvReaderList,
  updateAccLv,
} from '@/api/acclv'
import { queryKeys } from '@/lib/queryKeys'
import type { AccLvRdrInfo, AddAccLvReaderRequest, CreateAccLvRequest, UpdateAccLvRequest } from '@/types/api'

export const useAccLvList = () =>
  useQuery({ queryKey: queryKeys.acclv.all, queryFn: getAccLvList })

export const useCreateAccLv = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccLvRequest) => createAccLv(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.acclv.all }),
  })
}

export const useUpdateAccLv = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccLvRequest }) =>
      updateAccLv(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.acclv.all }),
  })
}

export const useDeleteAccLv = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAccLv(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.acclv.all }),
  })
}

export const useAccLvReaderList = (alvId: number) =>
  useQuery<AccLvRdrInfo[] | null, Error>({
    queryKey: queryKeys.acclv.reader(alvId),
    queryFn: () => getAccLvReaderList(alvId),
    enabled: alvId > 0,
  })

export const useAddAccLvReader = (alvId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddAccLvReaderRequest) => addAccLvReader(alvId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.acclv.reader(alvId) }),
  })
}

export const useDeleteAccLvReader = (alvId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ scpId, rdrId }: { scpId: number; rdrId: number }) =>
      deleteAccLvReader(alvId, scpId, rdrId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.acclv.reader(alvId) }),
  })
}
