import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCardfmt,
  deleteCardfmt,
  getCardfmtList,
  updateCardfmt,
} from '@/api/cardfmt'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateCardfmtRequest, UpdateCardfmtRequest } from '@/types/api'

export const useCardfmtList = () =>
  useQuery({ queryKey: queryKeys.cardfmt.all, queryFn: getCardfmtList })

export const useCreateCardfmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCardfmtRequest) => createCardfmt(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cardfmt.all }),
  })
}

export const useUpdateCardfmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCardfmtRequest }) =>
      updateCardfmt(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cardfmt.all }),
  })
}

export const useDeleteCardfmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCardfmt(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cardfmt.all }),
  })
}
