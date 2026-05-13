import { axiosInstance } from '@/lib/axios'
import type { CreateReaderRequest, ReaderInfo, UpdateReaderRequest } from '@/types/api'

export const getReaderList = async (scpId: number): Promise<ReaderInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<ReaderInfo[]>(`/api/scp/${scpId}/reader`)
    return data
  } catch {
    return null
  }
}

export const createReader = async (
  scpId: number,
  reader: CreateReaderRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/reader`, reader)
    return true
  } catch {
    return false
  }
}

export const updateReader = async (
  scpId: number,
  id: number,
  reader: UpdateReaderRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/scp/${scpId}/reader/${id}`, reader)
    return true
  } catch {
    return false
  }
}

export const deleteReader = async (scpId: number, id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/scp/${scpId}/reader/${id}`)
    return true
  } catch {
    return false
  }
}
