import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEmp, deleteEmp, getEmpList, updateEmp } from '@/api/emps'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateEmpRequest, UpdateEmpRequest } from '@/types/api'

export const useEmpList = () =>
  useQuery({ queryKey: queryKeys.emps.all, queryFn: getEmpList })

export const useCreateEmp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmpRequest) => createEmp(data),
    onSuccess: (result) => {
      if (result.ok) void qc.invalidateQueries({ queryKey: queryKeys.emps.all })
    },
  })
}

export const useUpdateEmp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmpRequest }) => updateEmp(id, data),
    onSuccess: (result) => {
      if (result.ok) void qc.invalidateQueries({ queryKey: queryKeys.emps.all })
    },
  })
}

export const useDeleteEmp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmp(id),
    onSuccess: (result) => {
      if (result.ok) void qc.invalidateQueries({ queryKey: queryKeys.emps.all })
    },
  })
}
