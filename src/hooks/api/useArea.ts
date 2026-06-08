import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createArea, deleteArea, getAreaList, updateArea } from '@/api/area'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateAreaRequest, UpdateAreaRequest } from '@/types/api'

export const useAreas = () =>
  useQuery({
    queryKey: queryKeys.areas.all(),
    queryFn: getAreaList,
  })

export const useCreateArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAreaRequest) => createArea(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.areas.all() }),
  })
}

export const useUpdateArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAreaRequest }) => updateArea(id, data),
    onSuccess: (_result, { id }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.areas.all() })
      void qc.invalidateQueries({ queryKey: queryKeys.areas.detail(id) })
    },
  })
}

export const useDeleteArea = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteArea(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: queryKeys.areas.all() }),
  })
}

/** @deprecated useAreas */
export const useAreaList = useAreas
