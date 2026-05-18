import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUserList, updateUser } from '@/api/users'
import { queryKeys } from '@/lib/query/queryKeys'
import type { CreateUserRequest, UpdateUserRequest } from '@/types/api/user'

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: getUserList,
  })

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (result) => {
      if (result.ok) void qc.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => updateUser(id, data),
    onSuccess: (result, { id }) => {
      if (result.ok) {
        void qc.invalidateQueries({ queryKey: queryKeys.users.all() })
        void qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      }
    },
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (result) => {
      if (result.ok) void qc.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}
