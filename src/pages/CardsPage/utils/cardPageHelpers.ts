import type { CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'
import { CARD_STATUS_VALUES, type CardStatusValue } from '@/pages/CardsPage/formTypes'

export type CardRow = CardInfo & { id: number }

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

export const cardTypeLabel = (c: CardInfo) => c.type ?? '직원'

const normalizeCardStatus = (status: string | undefined, isActive: boolean): CardStatusValue => {
  const s = status?.trim()
  if (s && (CARD_STATUS_VALUES as readonly string[]).includes(s)) return s as CardStatusValue
  if (s === '비활성') return '반납'
  return isActive ? '활성' : '반납'
}

export const cardStatusLabel = (c: CardInfo): CardStatusValue =>
  normalizeCardStatus(c.status, c.isActive)

export const cardStatusBadgeVariant = (
  status: string,
): 'on' | 'off' | 'lost' | 'issue' => {
  if (status === '활성') return 'on'
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
  isActive: values.status === '활성',
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
  isActive: values.status === '활성',
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
