import { axiosInstance } from '@/lib/infra/axios'
import { parseTimezoneList, timezoneToWire } from '@/lib/mappers/timezoneMappers'
import type {
  CreateTimezoneRequest,
  TimezoneInfo,
  UpdateTimezoneRequest,
} from '@/types/api'

export const getTimezoneList = async (): Promise<TimezoneInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/timezone')
    return parseTimezoneList(data)
  } catch {
    return null
  }
}

export const createTimezone = async (
  timezone: CreateTimezoneRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/timezone', { timezone: timezoneToWire(timezone, 0) })
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
    await axiosInstance.put(`/api/timezone/${id}`, { timezone: timezoneToWire(timezone, id) })
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
