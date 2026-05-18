import { axiosInstance } from '@/lib/infra/axios'
import type { LoginResponse } from '@/types/api'

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse | null> => {
  try {
    const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', {
      username,
      password,
    })
    return data
  } catch {
    return null
  }
}
