import { addCardAccLv, deleteCardAccLv } from '@/api/card'
import type { CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'
import type { UpdateCardFormValues } from '@/pages/CardsPage/formTypes'

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

/** 카드-접근권한 연결 diff 동기화 (생성·수정 저장 후 호출) */
export const syncCardAccLv = async (
  cid: number,
  beforeIds: number[],
  afterIds: number[],
): Promise<boolean> => {
  const before = new Set(beforeIds)
  const after = new Set(afterIds)
  const toAdd = afterIds.filter((id) => !before.has(id))
  const toRemove = beforeIds.filter((id) => !after.has(id))
  if (toAdd.length === 0 && toRemove.length === 0) return true

  const results = await Promise.all([
    ...toAdd.map((id) => addCardAccLv(cid, { accLvId: id })),
    ...toRemove.map((id) => deleteCardAccLv(cid, id)),
  ])
  return results.every(Boolean)
}

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
