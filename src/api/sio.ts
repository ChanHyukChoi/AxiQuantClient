import { axiosInstance } from '@/lib/axios'
import type { CreateSioRequest, SioInfo, UpdateSioRequest } from '@/types/api'

export const getSioList = async (scpId: number): Promise<SioInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<SioInfo[]>(`/api/scp/${scpId}/sio`)
    return data
  } catch {
    return null
  }
}

export const createSio = async (
  scpId: number,
  sio: CreateSioRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/sio`, sio)
    return true
  } catch {
    return false
  }
}

export const updateSio = async (
  scpId: number,
  id: number,
  sio: UpdateSioRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/scp/${scpId}/sio/${id}`, sio)
    return true
  } catch {
    return false
  }
}

export const deleteSio = async (scpId: number, id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/scp/${scpId}/sio/${id}`)
    return true
  } catch {
    return false
  }
}
