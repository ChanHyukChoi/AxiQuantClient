import i18n from '@/lib/i18n'

const t = () => i18n.getFixedT(null, 'entity')

/** UI에 DB id를 노출하지 않는 표시용 fallback */

export const fallbackAccLvName = (name?: string | null): string =>
  name?.trim() || t()('fallback.accLv')

export const fallbackAreaName = (name?: string | null): string =>
  name?.trim() || t()('fallback.area')

export const fallbackEmpName = (name?: string | null): string =>
  name?.trim() || t()('fallback.emp')

export const fallbackCardFmtName = (name?: string | null): string =>
  name?.trim() || t()('fallback.cardFmt')

export const fallbackAlarmName = (name?: string | null): string =>
  name?.trim() || t()('fallback.alarm')

export const fallbackMailAlarmName = (name?: string | null): string =>
  name?.trim() || t()('fallback.mailAlarm')

export const fallbackUserName = (name?: string | null): string =>
  name?.trim() || t()('fallback.user')

export const fallbackScpName = (name?: string | null): string =>
  name?.trim() || t()('fallback.scp')

export const fallbackReaderName = (name?: string | null): string =>
  name?.trim() || t()('fallback.reader')

export const fallbackTimezoneName = (name?: string | null): string =>
  name?.trim() || t()('fallback.timezone')

export const fallbackDeviceKindLabel = (kind: string): string => {
  const key = kind.toLowerCase()
  const label = t()(`deviceKind.${key}`, { defaultValue: '' })
  return label || kind
}
