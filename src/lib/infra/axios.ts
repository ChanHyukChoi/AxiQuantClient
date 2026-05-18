import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { router } from '@/router'

export const axiosInstance = axios.create()

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearToken()
      router.navigate({ to: '/login' })
    }
    return Promise.reject(error)
  },
)
