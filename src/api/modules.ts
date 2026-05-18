import { axiosInstance } from '@/lib/infra/axios'
import { parseModuleList } from '@/lib/mappers/moduleMappers'
import type { ModuleInfo } from '@/types/api'

export const getModuleList = async (): Promise<ModuleInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/modules')
    return parseModuleList(data)
  } catch {
    return null
  }
}
