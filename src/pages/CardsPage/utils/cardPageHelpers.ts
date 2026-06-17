import type { TFunction } from 'i18next'
import i18n from '@/lib/i18n'
import type { SelectOption } from '@/components/primitive/Select'
import type { CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import {
  CARD_STATUS_ACTIVE,
  CARD_STATUS_VALUES,
  CARD_TYPE_DEFAULT,
  CARD_TYPE_VALUES,
  type CardStatusValue,
} from '@/pages/CardsPage/formTypes'

export type CardRow = CardInfo & { id: number }

const TYPE_I18N_KEYS: Record<string, `type.${string}`> = {
  직원: 'type.employee',
  방문: 'type.visit',
  발급: 'type.issue',
}

const STATUS_I18N_KEYS: Record<CardStatusValue, `status.${string}`> = {
  활성: 'status.active',
  발급: 'status.issue',
  분실: 'status.lost',
  반납: 'status.returned',
}

export const cardTypeDisplay = (type: string, t?: TFunction<'card'>): string => {
  const key = TYPE_I18N_KEYS[type]
  if (!key) return type
  return t ? t(key) : i18n.t(key, { ns: 'card' })
}

export const cardStatusDisplay = (status: string, t?: TFunction<'card'>): string => {
  const key = STATUS_I18N_KEYS[status as CardStatusValue]
  if (!key) return status
  return t ? t(key) : i18n.t(key, { ns: 'card' })
}

export const getCardTypeOptions = (t: TFunction<'card'>): SelectOption[] =>
  CARD_TYPE_VALUES.map((value) => ({ value, label: cardTypeDisplay(value, t) }))

export const getCardStatusOptions = (t: TFunction<'card'>): SelectOption[] =>
  CARD_STATUS_VALUES.map((value) => ({ value, label: cardStatusDisplay(value, t) }))

export const cardPrimaryKey = (c: CardInfo): number | undefined => {
  const row = c as CardInfo & { id?: number }
  let pk = row.cid ?? row.id
  if ((pk == null || pk <= 0) && c.cardNumber.trim() !== '') {
    const fromNum = cardIdFromNumber(c.cardNumber)
    if (fromNum != null) pk = fromNum
  }
  if (typeof pk !== 'number' || !Number.isFinite(pk) || pk <= 0) return undefined
  return pk
}

export const cardTypeLabel = (c: CardInfo) => c.type ?? CARD_TYPE_DEFAULT

const normalizeCardStatus = (status: string | undefined, isActive: boolean): CardStatusValue => {
  const s = status?.trim()
  if (s && (CARD_STATUS_VALUES as readonly string[]).includes(s)) return s as CardStatusValue
  if (s === '비활성') return '반납'
  return isActive ? CARD_STATUS_ACTIVE : '반납'
}

export const cardStatusLabel = (c: CardInfo): CardStatusValue =>
  normalizeCardStatus(c.status, c.isActive)

export const cardStatusBadgeVariant = (
  status: string,
): 'on' | 'off' | 'lost' | 'issue' => {
  if (status === CARD_STATUS_ACTIVE) return 'on'
  if (status === '분실') return 'lost'
  if (status === '발급') return 'issue'
  return 'off'
}

export const cardIdFromNumber = (cardNumber: string): number | undefined => {
  const n = Math.trunc(Number(cardNumber.trim()))
  if (!Number.isFinite(n) || n <= 0) return undefined
  return n
}

/** wire `acttm` / `dacttm` → `datetime-local` input value */
export const cardDatetimeToInput = (raw?: string): string => {
  const t = raw?.trim()
  if (!t) return ''
  const isoLike = t.includes('T') ? t : t.replace(' ', 'T')
  const slice16 = isoLike.slice(0, 16)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slice16)) return slice16
  const dateOnly = t.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return `${dateOnly}T00:00`
  return ''
}

/** `datetime-local` → wire datetime (`yyyy-MM-dd HH:mm:ss`) */
export const cardInputToDatetime = (value: string): string | undefined => {
  const t = value.trim()
  if (!t) return undefined
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t)) return `${t.replace('T', ' ')}:00`
  return t
}

export const toCreateRequest = (
  values: UpdateCardFormValues,
  exemptApb: boolean,
  exemptPin: boolean,
): CreateCardRequest => ({
  cardNumber: values.cardNum.trim(),
  name: values.name.trim(),
  empId: values.empId,
  isActive: values.status === CARD_STATUS_ACTIVE,
  type: values.type,
  status: values.status,
  exemptApb,
  exemptPin,
  issuedAt: cardInputToDatetime(values.issuedAt),
  expiredAt: cardInputToDatetime(values.expiredAt),
  ...(values.changePin ? { pin: values.pin } : {}),
})

export const toUpdateRequest = (
  values: UpdateCardFormValues,
  base: CardInfo,
  exemptApb: boolean,
  exemptPin: boolean,
): UpdateCardRequest => ({
  cardNumber: values.cardNum.trim(),
  name: values.name.trim(),
  empId: values.empId,
  isActive: values.status === CARD_STATUS_ACTIVE,
  type: values.type,
  status: values.status,
  issuedAt: cardInputToDatetime(values.issuedAt),
  expiredAt: cardInputToDatetime(values.expiredAt),
  area: base.area,
  lastCtrl: base.lastCtrl,
  lastReader: base.lastReader,
  lastAccess: base.lastAccess,
  exemptApb,
  exemptPin,
  ...(values.changePin ? { pin: values.pin } : {}),
})
