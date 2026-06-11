import { axiosInstance } from '@/lib/infra/axios'
import type { CreateScpRequest, ScpInfo, UpdateScpRequest } from '@/types/api'

export const getScpList = async (): Promise<ScpInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<ScpInfo[]>('/api/scp')
    return data
  } catch {
    return null
  }
}

export const createScp = async (scp: CreateScpRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/scp', { scp: { id: 0, ...scp } })
    return true
  } catch {
    return false
  }
}

export const updateScp = async (id: number, scp: UpdateScpRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/scp/${id}`, { scp: { id, ...scp } })
    return true
  } catch {
    return false
  }
}

export const deleteScp = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/scp/${id}`)
    return true
  } catch {
    return false
  }
}

export const resetScp = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${id}/reset`)
    return true
  } catch {
    return false
  }
}
