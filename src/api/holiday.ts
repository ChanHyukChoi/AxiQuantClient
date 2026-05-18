import { axiosInstance } from '@/lib/axios'
import { holidayToWire, parseHolidayList } from '@/lib/holidayMappers'
import type { CreateHolidayRequest, HolidayInfo, UpdateHolidayRequest } from '@/types/api'

export const getHolidayList = async (): Promise<HolidayInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/holiday')
    return parseHolidayList(data)
  } catch {
    return null
  }
}

export const createHoliday = async (holiday: CreateHolidayRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/holiday', { holiday: holidayToWire(holiday, 0) })
    return true
  } catch {
    return false
  }
}

export const updateHoliday = async (id: number, holiday: UpdateHolidayRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/holiday/${id}`, { holiday: holidayToWire(holiday, id) })
    return true
  } catch {
    return false
  }
}

export const deleteHoliday = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/holiday/${id}`)
    return true
  } catch {
    return false
  }
}
