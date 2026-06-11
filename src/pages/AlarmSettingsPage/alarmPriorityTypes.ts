import type { AlarmPriorityInfo } from '@/types/api'

export interface AlarmPriorityStyle {
  fgColor: string
  bgColor: string
  bgEnabled: boolean
}

/** WPF 우선순위 UI 확장 필드 (API 미반영분) */
export interface AlarmPriorityExtra {
  alarmFg: string
  alarmBg: string
  alarmBgEnabled: boolean
  ackFg: string
  ackBg: string
  ackBgEnabled: boolean
  blinking: string
  alarmSound: string
}

export type AlarmPriorityDisplay = AlarmPriorityInfo & AlarmPriorityExtra

export const DEFAULT_ALARM_PRIORITY_EXTRA: AlarmPriorityExtra = {
  alarmFg: '#ffffff',
  alarmBg: '#2d6cdf',
  alarmBgEnabled: true,
  ackFg: '#a0a0a0',
  ackBg: '#2a2a2a',
  ackBgEnabled: false,
  blinking: 'off',
  alarmSound: 'none',
}

export const PRIORITY_BLINK_OPTIONS = [
  { value: 'off', label: '꺼짐' },
  { value: 'slow', label: '느림' },
  { value: 'fast', label: '빠름' },
] as const
