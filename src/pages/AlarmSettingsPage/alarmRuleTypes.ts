import type { TFunction } from 'i18next'
import type { SelectOption } from '@/components/primitive/Select'
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

export const getAlarmSoundOptions = (t: TFunction<'alarm'>): SelectOption[] => [
  { value: 'none', label: t('sound.none') },
  { value: 'beep1', label: t('sound.beep1') },
  { value: 'beep2', label: t('sound.beep2') },
  { value: 'siren', label: t('sound.siren') },
]

export const getAlarmTimezoneOptions = (t: TFunction<'alarm'>): SelectOption[] => [
  { value: 'default', label: t('timezoneOption.default') },
  { value: 'always', label: t('timezoneOption.always') },
  { value: 'business', label: t('timezoneOption.business') },
]
