import { axiosInstance } from '@/lib/infra/axios'
import type { OutputControlAction, ReaderControlAction } from '@/types/api/deviceControl'

export const controlReader = async (
  scpId: number,
  readerId: number,
  action: ReaderControlAction,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/reader/${readerId}/control`, { action })
    return true
  } catch {
    return false
  }
}

export const controlOutput = async (
  scpId: number,
  outputId: number,
  action: OutputControlAction,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/scp/${scpId}/output/${outputId}/control`, { action })
    return true
  } catch {
    return false
  }
}
