import { axiosInstance } from '@/lib/axios'
import type { ModuleInfo } from '@/types/api'

export const getModuleList = async (): Promise<ModuleInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<ModuleInfo[]>('/api/modules')
    return data
  } catch {
    return null
  }
}
