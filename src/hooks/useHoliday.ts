import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createHoliday, deleteHoliday, getHolidayList, updateHoliday } from '@/api/holiday'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateHolidayRequest, UpdateHolidayRequest } from '@/types/api'

export const useHolidayList = () =>
  useQuery({ queryKey: queryKeys.holiday.all, queryFn: getHolidayList })

export const useCreateHoliday = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateHolidayRequest) => createHoliday(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.holiday.all }),
  })
}

export const useUpdateHoliday = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHolidayRequest }) =>
      updateHoliday(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.holiday.all }),
  })
}

export const useDeleteHoliday = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteHoliday(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.holiday.all }),
  })
}
