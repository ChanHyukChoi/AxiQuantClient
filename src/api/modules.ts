import { axiosInstance } from '@/lib/axios'
import { parseModuleList } from '@/lib/moduleMappers'
import type { ModuleInfo } from '@/types/api'

export const getModuleList = async (): Promise<ModuleInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/modules')
    return parseModuleList(data)
  } catch {
    return null
  }
}
