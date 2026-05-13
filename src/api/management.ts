import { axiosInstance } from '@/lib/axios'
import type { LogLevelInfo, StartTestEventsRequest, TestEventStatus } from '@/types/api'

export const getLogLevel = async (target?: string): Promise<LogLevelInfo | null> => {
  try {
    const { data } = await axiosInstance.get<LogLevelInfo>('/api/management/loglevel', {
      params: target ? { target } : undefined,
    })
    return data
  } catch {
    return null
  }
}

export const setLogLevel = async (target: string, level: string): Promise<boolean> => {
  try {
    await axiosInstance.put('/api/management/loglevel', { target, level })
    return true
  } catch {
    return false
  }
}

export const getTestEventStatus = async (): Promise<TestEventStatus | null> => {
  try {
    const { data } = await axiosInstance.get<TestEventStatus>(
      '/api/management/test-events/status',
    )
    return data
  } catch {
    return null
  }
}

export const startTestEvents = async (
  options?: StartTestEventsRequest,
): Promise<TestEventStatus | null> => {
  try {
    const { data } = await axiosInstance.post<TestEventStatus>(
      '/api/management/test-events/start',
      options ?? {},
    )
    return data
  } catch {
    return null
  }
}

export const stopTestEvents = async (): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/management/test-events/stop')
    return true
  } catch {
    return false
  }
}
