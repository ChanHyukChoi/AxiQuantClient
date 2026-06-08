import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTimezone,
  deleteTimezone,
  getTimezoneList,
  updateTimezone,
} from '@/api/timezone'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateTimezoneRequest, UpdateTimezoneRequest } from '@/types/api'

export const useTimezoneList = () =>
  useQuery({ queryKey: queryKeys.timezone.all, queryFn: getTimezoneList })

export const useCreateTimezone = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTimezoneRequest) => createTimezone(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.timezone.all }),
  })
}

export const useUpdateTimezone = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimezoneRequest }) =>
      updateTimezone(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.timezone.all }),
  })
}

export const useDeleteTimezone = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTimezone(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.timezone.all }),
  })
}
