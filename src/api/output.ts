import { axiosInstance } from '@/lib/infra/axios'
import type { CreateOutputRequest, OutputInfo, UpdateOutputRequest } from '@/types/api'

export const getOutputList = async (scpId: number): Promise<OutputInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<OutputInfo[]>(`/api/scp/${scpId}/output`)
    return data
  } catch {
    return null
  }
}

export const createOutput = async (scpId: number, output: CreateOutputRequest): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/output`, { output: { id: -1, scp: scpId, ...output } })
    return true
  } catch {
    return false
  }
}

export const updateOutput = async (
  scpId: number,
  id: number,
  output: UpdateOutputRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/scp/${scpId}/output/${id}`, { output: { id, scp: scpId, ...output } })
    return true
  } catch {
    return false
  }
}

export const deleteOutput = async (scpId: number, id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/scp/${scpId}/output/${id}`)
    return true
  } catch {
    return false
  }
}
