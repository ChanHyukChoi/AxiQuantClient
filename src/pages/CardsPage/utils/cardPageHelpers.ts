import type { CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'

export type CardRow = CardInfo & { id: number }

export const cardPrimaryKey = (c: CardInfo): number | undefined => {
  const row = c as CardInfo & { id?: number }
  const pk = row.cid ?? row.id
  if (typeof pk !== 'number' || !Number.isFinite(pk)) return undefined
  return pk
}

export const cardTypeLabel = (c: CardInfo) => c.type ?? '직원'
export const cardStatusLabel = (c: CardInfo) => c.status ?? (c.isActive ? '활성' : '비활성')

export const cardIdFromNumber = (cardNumber: string): number | undefined => {
  const n = Math.trunc(Number(cardNumber.trim()))
  if (!Number.isFinite(n) || n <= 0) return undefined
  return n
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
  issuedAt: base.issuedAt,
  expiredAt: base.expiredAt,
  area: base.area,
  lastCtrl: base.lastCtrl,
  lastReader: base.lastReader,
  lastAccess: base.lastAccess,
  exemptApb,
  exemptPin,
})
