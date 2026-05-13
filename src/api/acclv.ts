import { axiosInstance } from '@/lib/axios'
import type {
  AccLvInfo,
  AccLvRdrInfo,
  AddAccLvReaderRequest,
  CreateAccLvRequest,
  UpdateAccLvRequest,
} from '@/types/api'

export const getAccLvList = async (): Promise<AccLvInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<AccLvInfo[]>('/api/acclv')
    return data
  } catch {
    return null
  }
}

export const createAccLv = async (acclv: CreateAccLvRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/acclv', acclv)
    return true
  } catch {
    return false
  }
}

export const updateAccLv = async (
  id: number,
  acclv: UpdateAccLvRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/acclv/${id}`, acclv)
    return true
  } catch {
    return false
  }
}

export const deleteAccLv = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/acclv/${id}`)
    return true
  } catch {
    return false
  }
}

export const getAccLvReaderList = async (
  alvId: number,
): Promise<AccLvRdrInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<AccLvRdrInfo[]>(`/api/acclv/${alvId}/reader`)
    return data
  } catch {
    return null
  }
}

export const addAccLvReader = async (
  alvId: number,
  rdr: AddAccLvReaderRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/acclv/${alvId}/reader`, rdr)
    return true
  } catch {
    return false
  }
}

export const deleteAccLvReader = async (
  alvId: number,
  scpId: number,
  rdrId: number,
): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/acclv/${alvId}/reader/${scpId}/${rdrId}`)
    return true
  } catch {
    return false
  }
}
