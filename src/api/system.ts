import { axiosInstance } from '@/lib/infra/axios'
import { parseLicenseInfo } from '@/lib/mappers/systemMappers'
import type { LicenseInfo } from '@/types/api/system'

export const getLicenseInfo = async (): Promise<LicenseInfo | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/modules')
    return parseLicenseInfo(data)
  } catch {
    return null
  }
}
