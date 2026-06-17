import { axiosInstance } from '@/lib/infra/axios'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

const parseLinkageList = (data: unknown): LinkageRule[] => {
  if (Array.isArray(data)) return data as LinkageRule[]
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    const items = o.items ?? o.data ?? o.linkages
    if (Array.isArray(items)) return items as LinkageRule[]
  }
  return []
}

export const getLinkageList = async (): Promise<LinkageRule[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/linkage')
    return parseLinkageList(data)
  } catch {
    return null
  }
}

/** 백엔드 제안: `POST /api/linkage` body = 규칙 JSON */
export const createLinkage = async (rule: Omit<LinkageRule, 'id'>): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/linkage', rule)
    return true
  } catch {
    return false
  }
}

/** 백엔드 제안: `PUT /api/linkage/{id}` */
export const updateLinkage = async (id: number, rule: LinkageRule): Promise<boolean> => {
  const nid = Math.trunc(id)
  if (!Number.isFinite(nid) || nid <= 0) return false
  try {
    await axiosInstance.put(`/api/linkage/${nid}`, rule)
    return true
  } catch {
    return false
  }
}

/** 백엔드 제안: `DELETE /api/linkage/{id}` */
export const deleteLinkage = async (id: number): Promise<boolean> => {
  const nid = Math.trunc(id)
  if (!Number.isFinite(nid) || nid <= 0) return false
  try {
    await axiosInstance.delete(`/api/linkage/${nid}`)
    return true
  } catch {
    return false
  }
}
