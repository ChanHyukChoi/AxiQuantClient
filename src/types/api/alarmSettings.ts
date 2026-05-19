export interface AlarmInfo {
  id: number
  name: string
  deviceId: number
  deviceType: string
  eventCondition: string
  active: number
}

export type CreateAlarmRequest = Omit<AlarmInfo, 'id'>
export type UpdateAlarmRequest = Omit<AlarmInfo, 'id'>

export interface AlarmPriorityInfo {
  id: number
  priority: number
  color: string
}

export type CreateAlarmPriorityRequest = Omit<AlarmPriorityInfo, 'id'>
export type UpdateAlarmPriorityRequest = Omit<AlarmPriorityInfo, 'id'>

export interface AlarmMailInfo {
  id: number
  name: string
  alarmIds: number[]
  emails: string[]
}

export type CreateAlarmMailRequest = Omit<AlarmMailInfo, 'id'>
export type UpdateAlarmMailRequest = Omit<AlarmMailInfo, 'id'>
