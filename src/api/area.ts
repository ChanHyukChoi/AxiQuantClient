import { axiosInstance } from '@/lib/axios'
import type { AreaInfo, CreateAreaRequest, UpdateAreaRequest } from '@/types/api'

export const getAreaList = async (): Promise<AreaInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<AreaInfo[]>('/api/area')
    return data
  } catch {
    return null
  }
}

export const createArea = async (area: CreateAreaRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/area', { area: { id: 0, ...area } })
    return true
  } catch {
    return false
  }
}

export const updateArea = async (id: number, area: UpdateAreaRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/area/${id}`, { area: { id, ...area } })
    return true
  } catch {
    return false
  }
}

export const deleteArea = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/area/${id}`)
    return true
  } catch {
    return false
  }
}
