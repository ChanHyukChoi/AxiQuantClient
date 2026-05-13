import { axiosInstance } from '@/lib/axios'
import type { CreateEmpRequest, EmpInfo, UpdateEmpRequest } from '@/types/api'

export const getEmpList = async (): Promise<EmpInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<EmpInfo[]>('/api/emps')
    return data
  } catch {
    return null
  }
}

export const createEmp = async (emp: CreateEmpRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/emps', emp)
    return true
  } catch {
    return false
  }
}

export const updateEmp = async (id: number, emp: UpdateEmpRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/emps/${id}`, emp)
    return true
  } catch {
    return false
  }
}

export const deleteEmp = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/emps/${id}`)
    return true
  } catch {
    return false
  }
}
