import { axiosInstance } from '@/lib/infra/axios'
import type { CardfmtInfo, CreateCardfmtRequest, UpdateCardfmtRequest } from '@/types/api'

export const getCardfmtList = async (): Promise<CardfmtInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<CardfmtInfo[]>('/api/cardfmt')
    return data
  } catch {
    return null
  }
}

export const createCardfmt = async (cardfmt: CreateCardfmtRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/cardfmt', { cardfmt: { id: 0, ...cardfmt } })
    return true
  } catch {
    return false
  }
}

export const updateCardfmt = async (id: number, cardfmt: UpdateCardfmtRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/cardfmt/${id}`, { cardfmt: { id, ...cardfmt } })
    return true
  } catch {
    return false
  }
}

export const deleteCardfmt = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/cardfmt/${id}`)
    return true
  } catch {
    return false
  }
}
