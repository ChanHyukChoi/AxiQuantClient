import { fallbackDeviceKindLabel, fallbackScpName } from '@/lib/app/entityDisplayLabels'
import i18n from '@/lib/i18n'
import type { AlarmInfo, AlarmMailInfo, AlarmPriorityInfo } from '@/types/api'

export const isAlarmActive = (active: number): boolean => active !== 0

export const normalizeHexColor = (value: string): string => {
  const trimmed = value.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed
  const bare = trimmed.replace(/^#/, '')
  if (/^[0-9A-Fa-f]{6}$/.test(bare)) return `#${bare}`
  return '#4f9cf9'
}

export const alarmToUpdatePayload = (alarm: AlarmInfo): Omit<AlarmInfo, 'id'> => {
  const { id, ...rest } = alarm
  void id
  return rest
}

export const priorityToUpdatePayload = (
  item: AlarmPriorityInfo,
): Omit<AlarmPriorityInfo, 'id'> => {
  const { id, ...rest } = item
  void id
  return { ...rest, color: normalizeHexColor(rest.color) }
}

export const mailToUpdatePayload = (item: AlarmMailInfo): Omit<AlarmMailInfo, 'id'> => {
  const { id, ...rest } = item
  void id
  return rest
}

export const deviceDisplayLabel = (
  deviceType: string,
  deviceId: number,
  scpNameMap?: Record<number, string>,
): string => {
  if (!deviceType || deviceId <= 0) return i18n.t('select.deviceNotConnected', { ns: 'alarm' })
  if (deviceType === 'scp' && scpNameMap?.[deviceId]) {
    return fallbackScpName(scpNameMap[deviceId])
  }
  return fallbackDeviceKindLabel(deviceType)
}

export const sortByPriority = (items: AlarmPriorityInfo[]): AlarmPriorityInfo[] =>
  [...items].sort((a, b) => a.priority - b.priority)
