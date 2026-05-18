import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCardfmt,
  deleteCardfmt,
  getCardfmtList,
  updateCardfmt,
} from '@/api/cardfmt'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateCardfmtRequest, UpdateCardfmtRequest } from '@/types/api'

export const useCardFmts = () =>
  useQuery({
    queryKey: queryKeys.cardFmts.all(),
    queryFn: getCardfmtList,
  })

export const useCreateCardFmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCardfmtRequest) => createCardfmt(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.cardFmts.all() }),
  })
}

export const useUpdateCardFmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCardfmtRequest }) =>
      updateCardfmt(id, data),
    onSuccess: (_result, { id }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.cardFmts.all() })
      void qc.invalidateQueries({ queryKey: queryKeys.cardFmts.detail(id) })
    },
  })
}

export const useDeleteCardFmt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCardfmt(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.cardFmts.all() }),
  })
}

/** @deprecated useCardFmts */
export const useCardfmtList = useCardFmts

/** @deprecated useCreateCardFmt */
export const useCreateCardfmt = useCreateCardFmt

/** @deprecated useUpdateCardFmt */
export const useUpdateCardfmt = useUpdateCardFmt

/** @deprecated useDeleteCardFmt */
export const useDeleteCardfmt = useDeleteCardFmt
