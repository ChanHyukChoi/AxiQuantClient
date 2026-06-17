import type { TFunction } from 'i18next'
import type { SelectOption } from '@/components/primitive/Select'
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

export const getPriorityBlinkOptions = (t: TFunction<'alarm'>): SelectOption[] => [
  { value: 'off', label: t('blink.off') },
  { value: 'slow', label: t('blink.slow') },
  { value: 'fast', label: t('blink.fast') },
]
