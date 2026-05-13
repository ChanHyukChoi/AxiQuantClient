import { axiosInstance } from '@/lib/axios'
import type {
  CreateTimezoneRequest,
  TimezoneInfo,
  UpdateTimezoneRequest,
} from '@/types/api'

export const getTimezoneList = async (): Promise<TimezoneInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<TimezoneInfo[]>('/api/timezone')
    return data
  } catch {
    return null
  }
}

export const createTimezone = async (
  timezone: CreateTimezoneRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/timezone', timezone)
    return true
  } catch {
    return false
  }
}

export const updateTimezone = async (
  id: number,
  timezone: UpdateTimezoneRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/timezone/${id}`, timezone)
    return true
  } catch {
    return false
  }
}

export const deleteTimezone = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/timezone/${id}`)
    return true
  } catch {
    return false
  }
}
