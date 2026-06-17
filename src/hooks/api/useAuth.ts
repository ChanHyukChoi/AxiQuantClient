import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/auth'
import type { LoginResponse } from '@/types/api'

export const useLogin = () =>
  useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
  })

export type { LoginResponse }
