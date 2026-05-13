import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createArea, deleteArea, getAreaList, updateArea } from '@/api/area'
import { queryKeys } from '@/lib/queryKeys'
import type { CreateAreaRequest, UpdateAreaRequest } from '@/types/api'

export const useAreaList = () =>
  useQuery({ queryKey: queryKeys.area.all, queryFn: getAreaList })

export const useCreateArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAreaRequest) => createArea(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.area.all }),
  })
}

export const useUpdateArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAreaRequest }) => updateArea(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.area.all }),
  })
}

export const useDeleteArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteArea(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.area.all }),
  })
}
