import { axiosInstance } from '@/lib/axios'
import type { CreateInputRequest, InputInfo, UpdateInputRequest } from '@/types/api'

export const getInputList = async (scpId: number): Promise<InputInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<InputInfo[]>(`/api/scp/${scpId}/input`)
    return data
  } catch {
    return null
  }
}

export const createInput = async (scpId: number, input: CreateInputRequest): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/input`, { input: { id: -1, scp: scpId, ...input } })
    return true
  } catch {
    return false
  }
}

export const updateInput = async (
  scpId: number,
  id: number,
  input: UpdateInputRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/scp/${scpId}/input/${id}`, { input: { id, scp: scpId, ...input } })
    return true
  } catch {
    return false
  }
}

export const deleteInput = async (scpId: number, id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/scp/${scpId}/input/${id}`)
    return true
  } catch {
    return false
  }
}
