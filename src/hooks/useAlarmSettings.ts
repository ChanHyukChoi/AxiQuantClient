import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAlarm,
  createAlarmMail,
  createAlarmPriority,
  deleteAlarm,
  deleteAlarmMail,
  deleteAlarmPriority,
  getAlarmList,
  getAlarmMailList,
  getAlarmPriorityList,
  updateAlarm,
  updateAlarmMail,
  updateAlarmPriority,
} from '@/api/alarmSettings'
import { queryKeys } from '@/lib/query/queryKeys'
import type {
  CreateAlarmMailRequest,
  CreateAlarmPriorityRequest,
  CreateAlarmRequest,
  UpdateAlarmMailRequest,
  UpdateAlarmPriorityRequest,
  UpdateAlarmRequest,
} from '@/types/api'

export const useAlarms = () =>
  useQuery({
    queryKey: queryKeys.alarmSettings.alarms(),
    queryFn: getAlarmList,
  })

export const useCreateAlarm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAlarmRequest) => createAlarm(data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.alarms() })
    },
  })
}

export const useUpdateAlarm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAlarmRequest }) => updateAlarm(id, data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.alarms() })
    },
  })
}

export const useDeleteAlarm = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAlarm(id),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.alarms() })
    },
  })
}

export const useAlarmPriorities = () =>
  useQuery({
    queryKey: queryKeys.alarmSettings.priorities(),
    queryFn: getAlarmPriorityList,
  })

export const useCreateAlarmPriority = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAlarmPriorityRequest) => createAlarmPriority(data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.priorities() })
    },
  })
}

export const useUpdateAlarmPriority = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAlarmPriorityRequest }) =>
      updateAlarmPriority(id, data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.priorities() })
    },
  })
}

export const useDeleteAlarmPriority = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAlarmPriority(id),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.priorities() })
    },
  })
}

export const useAlarmMails = () =>
  useQuery({
    queryKey: queryKeys.alarmSettings.mails(),
    queryFn: getAlarmMailList,
  })

export const useCreateAlarmMail = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAlarmMailRequest) => createAlarmMail(data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.mails() })
    },
  })
}

export const useUpdateAlarmMail = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAlarmMailRequest }) =>
      updateAlarmMail(id, data),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.mails() })
    },
  })
}

export const useDeleteAlarmMail = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAlarmMail(id),
    onSuccess: (ok) => {
      if (ok) void qc.invalidateQueries({ queryKey: queryKeys.alarmSettings.mails() })
    },
  })
}
