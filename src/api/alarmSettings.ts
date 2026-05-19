import { axiosInstance } from '@/lib/infra/axios'
import type {
  AlarmInfo,
  AlarmMailInfo,
  AlarmPriorityInfo,
  CreateAlarmMailRequest,
  CreateAlarmPriorityRequest,
  CreateAlarmRequest,
  UpdateAlarmMailRequest,
  UpdateAlarmPriorityRequest,
  UpdateAlarmRequest,
} from '@/types/api'

const parseList = <T>(data: unknown): T[] | null => {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    for (const key of ['items', 'data', 'alarms', 'priorities', 'mails']) {
      if (Array.isArray(o[key])) return o[key] as T[]
    }
  }
  return null
}

export const getAlarmList = async (): Promise<AlarmInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/alarm')
    return parseList<AlarmInfo>(data) ?? []
  } catch {
    return null
  }
}

export const createAlarm = async (body: CreateAlarmRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/alarm', body)
    return true
  } catch {
    return false
  }
}

export const updateAlarm = async (id: number, body: UpdateAlarmRequest): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/alarm/${id}`, body)
    return true
  } catch {
    return false
  }
}

export const deleteAlarm = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/alarm/${id}`)
    return true
  } catch {
    return false
  }
}

export const getAlarmPriorityList = async (): Promise<AlarmPriorityInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/alarm/priority')
    return parseList<AlarmPriorityInfo>(data) ?? []
  } catch {
    return null
  }
}

export const createAlarmPriority = async (
  body: CreateAlarmPriorityRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/alarm/priority', body)
    return true
  } catch {
    return false
  }
}

export const updateAlarmPriority = async (
  id: number,
  body: UpdateAlarmPriorityRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/alarm/priority/${id}`, body)
    return true
  } catch {
    return false
  }
}

export const deleteAlarmPriority = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/alarm/priority/${id}`)
    return true
  } catch {
    return false
  }
}

export const getAlarmMailList = async (): Promise<AlarmMailInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/alarm/mail')
    return parseList<AlarmMailInfo>(data) ?? []
  } catch {
    return null
  }
}

export const createAlarmMail = async (body: CreateAlarmMailRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/alarm/mail', body)
    return true
  } catch {
    return false
  }
}

export const updateAlarmMail = async (
  id: number,
  body: UpdateAlarmMailRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/alarm/mail/${id}`, body)
    return true
  } catch {
    return false
  }
}

export const deleteAlarmMail = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/alarm/mail/${id}`)
    return true
  } catch {
    return false
  }
}
