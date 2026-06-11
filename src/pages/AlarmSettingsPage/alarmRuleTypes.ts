import type { AlarmInfo } from '@/types/api'

/** WPF 경보 설정 UI 확장 필드 (API 미반영분 — 로컬/목업) */
export interface AlarmRuleExtra {
  eventCode: string
  scpId: number
  priority: number
  monitoring: boolean
  ackRequired: boolean
  alarmSound: string
  timezone: string
  userIds: number[]
}

export type AlarmRuleDisplay = AlarmInfo & AlarmRuleExtra

export interface AlarmRuleFormState {
  name: string
  active: number
  eventCode: string
  scpId: number
  deviceId: number
  deviceType: string
  eventCondition: string
  priority: number
  monitoring: boolean
  ackRequired: boolean
  alarmSound: string
  timezone: string
  userIds: number[]
}

export const DEFAULT_ALARM_RULE_EXTRA: AlarmRuleExtra = {
  eventCode: '',
  scpId: 0,
  priority: 50,
  monitoring: true,
  ackRequired: false,
  alarmSound: 'none',
  timezone: 'default',
  userIds: [],
}

export const ALARM_EVENT_CODE_OPTIONS = [
  { value: 'ihs_accel', label: 'IHS Accelerometer Alert' },
  { value: 'adam_input', label: 'ADAM Input State Changed' },
  { value: 'acc_door', label: 'Access Door Forced Open' },
  { value: 'input_changed', label: 'Input State Changed' },
  { value: 'output_changed', label: 'Output State Changed' },
] as const

export const ALARM_SOUND_OPTIONS = [
  { value: 'none', label: '사용 안함' },
  { value: 'beep1', label: '경보음 1' },
  { value: 'beep2', label: '경보음 2' },
  { value: 'siren', label: '사이렌' },
] as const

export const ALARM_TIMEZONE_OPTIONS = [
  { value: 'default', label: '기본' },
  { value: 'always', label: '항상' },
  { value: 'business', label: '업무시간' },
] as const
