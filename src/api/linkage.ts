import { axiosInstance } from '@/lib/infra/axios'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export const getLinkageList = async (): Promise<LinkageRule[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/linkage')
    if (Array.isArray(data)) return data as LinkageRule[]
    if (data && typeof data === 'object') {
      const o = data as Record<string, unknown>
      const items = o.items ?? o.data ?? o.linkages
      if (Array.isArray(items)) return items as LinkageRule[]
    }
    return []
  } catch {
    return null
  }
}
