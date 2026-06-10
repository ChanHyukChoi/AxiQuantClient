import { asRecordArray, firstNumber, optionalString } from '@/lib/wire/wireJson'
import type { CardInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api/card'

const FLAG_EXEMPT_APB = 0x01
const FLAG_EXEMPT_PIN = 0x02

const boolField = (row: Record<string, unknown>, keys: string[]): boolean | undefined => {
  for (const k of keys) {
    const v = row[k]
    if (typeof v === 'boolean') return v
    if (typeof v === 'number') return v !== 0
    if (typeof v === 'string') {
      const s = v.toLowerCase()
      if (s === 'true' || s === '1') return true
      if (s === 'false' || s === '0') return false
    }
  }
  return undefined
}

const flagsFromBools = (exemptApb?: boolean, exemptPin?: boolean, base = 0): number => {
  let f = base
  if (exemptApb) f |= FLAG_EXEMPT_APB
  if (exemptPin) f |= FLAG_EXEMPT_PIN
  return f
}

const boolsFromFlags = (flags: number): { exemptApb: boolean; exemptPin: boolean } => ({
  exemptApb: (flags & FLAG_EXEMPT_APB) !== 0,
  exemptPin: (flags & FLAG_EXEMPT_PIN) !== 0,
})

const cardIdFromRow = (row: Record<string, unknown>): number =>
  firstNumber(row, ['id', 'cid', 'cardId', 'cardNumber', 'cardNum', 'num'])

const stateToActive = (state: number): boolean => state > 0

const activeToState = (isActive: boolean): number => (isActive ? 1 : 0)

/** WPF CardsPage 유형 라벨 ↔ 서버 ctype (AdminClient 기준) */
const CTYPE_BY_LABEL: Record<string, number> = {
  직원: 1,
  방문: 2,
  발급: 3,
}

const CTYPE_TO_LABEL: Record<number, string> = {
  1: '직원',
  2: '방문',
  3: '발급',
}

const ctypeFromType = (type?: string): number => {
  const t = type?.trim()
  if (!t) return 0
  const byLabel = CTYPE_BY_LABEL[t]
  if (byLabel != null) return byLabel
  const n = Number(t)
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

const typeFromCtype = (ctype: number, fallback?: string): string | undefined => {
  const fb = fallback?.trim()
  if (fb) {
    if (CTYPE_BY_LABEL[fb] != null) return fb
    const n = Number(fb)
    if (Number.isFinite(n) && CTYPE_TO_LABEL[Math.trunc(n)]) return CTYPE_TO_LABEL[Math.trunc(n)]
    return fb
  }
  return CTYPE_TO_LABEL[ctype] ?? (ctype > 0 ? String(ctype) : undefined)
}

const wireOptionalString = (v?: string): string | undefined => {
  const t = v?.trim()
  return t ? t : undefined
}

export const resolveCardId = (cardNumber: string): number => {
  const n = Number(cardNumber.trim())
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.trunc(n)
}

export const wireToCardInfo = (row: Record<string, unknown>): CardInfo => {
  const id = cardIdFromRow(row)
  const flags = firstNumber(row, ['flags'])
  const state = firstNumber(row, ['state'])
  const { exemptApb, exemptPin } = boolsFromFlags(flags)
  const isActiveField = boolField(row, ['isActive', 'active'])
  const isActive = isActiveField ?? stateToActive(state)

  return {
    cid: id,
    cardNumber: id > 0 ? String(id) : (optionalString(row, 'cardNumber') ?? ''),
    name: optionalString(row, 'name'),
    empId: firstNumber(row, ['emp', 'empId']) || undefined,
    empName: optionalString(row, 'empName'),
    isActive,
    issuedAt:
      optionalString(row, 'acttm') ??
      optionalString(row, 'issuedAt') ??
      optionalString(row, 'issue'),
    expiredAt: optionalString(row, 'dacttm') ?? optionalString(row, 'expiredAt'),
    type: typeFromCtype(firstNumber(row, ['ctype']), optionalString(row, 'type')),
    status: optionalString(row, 'status') ?? (isActive ? '활성' : '비활성'),
    area: optionalString(row, 'area'),
    lastCtrl: optionalString(row, 'lastCtrl'),
    lastReader: optionalString(row, 'lastReader'),
    lastAccess: optionalString(row, 'lastAccess'),
    exemptApb: boolField(row, ['exemptApb']) ?? exemptApb,
    exemptPin: boolField(row, ['exemptPin']) ?? exemptPin,
  }
}

const extractCardRows = (data: unknown): Record<string, unknown>[] => {
  if (data == null) return []
  if (Array.isArray(data)) return asRecordArray(data)
  if (typeof data !== 'object') return []
  const o = data as Record<string, unknown>
  const nested = o.items ?? o.data ?? o.cards ?? o.list ?? o.values ?? o.results
  if (nested != null) return asRecordArray(nested)
  if (Array.isArray(o.card)) return asRecordArray(o.card)
  return []
}

export const parseCardList = (data: unknown): CardInfo[] => {
  const rows = extractCardRows(data)
  return rows.map(wireToCardInfo).filter((c) => c.cid > 0 || c.cardNumber.trim() !== '')
}

export const cardToWire = (
  card: CreateCardRequest | UpdateCardRequest,
  id: number,
): Record<string, unknown> => {
  const flags = flagsFromBools(card.exemptApb, card.exemptPin)
  const state = activeToState(card.isActive)
  const issued = wireOptionalString(card.issuedAt)
  const expired = wireOptionalString(card.expiredAt)

  const wire: Record<string, unknown> = {
    id,
    name: card.name ?? '',
    ctype: ctypeFromType(card.type),
    state,
    flags,
    emp: card.empId ?? 0,
    pin: card.pin?.trim() ?? '',
  }

  if (issued) {
    wire.issue = issued
    wire.acttm = issued
  }
  if (expired) wire.dacttm = expired

  return wire
}

export const createCardToWire = (card: CreateCardRequest): Record<string, unknown> => {
  const id = resolveCardId(card.cardNumber)
  return cardToWire(card, id)
}

export const updateCardToWire = (card: UpdateCardRequest, id: number): Record<string, unknown> =>
  cardToWire(card, id)
