import i18n from '@/lib/i18n'
import {
  ALARM_EVENT_CODE_OPTIONS,
  getAlarmSoundOptions,
  getAlarmTimezoneOptions,
  type AlarmRuleDisplay,
} from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import { deviceDisplayLabel, isAlarmActive } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'

export const eventCodeLabel = (code: string): string =>
  ALARM_EVENT_CODE_OPTIONS.find((o) => o.value === code)?.label ?? (code || '—')

export const alarmSoundLabel = (sound: string): string => {
  const t = i18n.getFixedT(null, 'alarm')
  return getAlarmSoundOptions(t).find((o) => o.value === sound)?.label ?? (sound || '—')
}

export const timezoneLabel = (tz: string): string => {
  const t = i18n.getFixedT(null, 'alarm')
  return getAlarmTimezoneOptions(t).find((o) => o.value === tz)?.label ?? (tz || '—')
}

export const scpNameForRule = (
  rule: AlarmRuleDisplay,
  scpNameMap: Record<number, string>,
): string => {
  if (rule.scpId > 0 && scpNameMap[rule.scpId]) return scpNameMap[rule.scpId]
  if (rule.deviceType === 'scp' && rule.deviceId > 0 && scpNameMap[rule.deviceId]) {
    return scpNameMap[rule.deviceId]
  }
  return '—'
}

export const deviceNameForRule = (
  rule: AlarmRuleDisplay,
  scpNameMap: Record<number, string>,
): string => deviceDisplayLabel(rule.deviceType, rule.deviceId, scpNameMap)

export const isRuleDisabled = (rule: AlarmRuleDisplay): boolean => !isAlarmActive(rule.active)
