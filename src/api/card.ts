import axios from 'axios'
import { axiosInstance } from '@/lib/infra/axios'
import {
  createCardToWire,
  parseCardList,
  resolveCardId,
  updateCardToWire,
} from '@/lib/mappers/cardMappers'
import { asRecordArray, firstNumber, optionalString } from '@/lib/wire/wireJson'
import type {
  AddCardAccLvRequest,
  CardAccLvInfo,
  CardInfo,
  CreateCardRequest,
  MoveCardAreaRequest,
  UpdateCardRequest,
} from '@/types/api'

const normalizeCardAccLvRow = (row: Record<string, unknown>): CardAccLvInfo => ({
  cid: firstNumber(row, ['cid', 'cardId', 'id']),
  alvid: firstNumber(row, ['alvid', 'accLvId']),
  state: 'state' in row ? firstNumber(row, ['state']) : undefined,
  acttm: optionalString(row, 'acttm'),
  dacttm: optionalString(row, 'dacttm'),
  ext: optionalString(row, 'ext'),
})

const describeCardListRaw = (data: unknown): Record<string, unknown> => {
  if (data == null) return { kind: 'null' }
  if (Array.isArray(data)) {
    return {
      kind: 'array',
      length: data.length,
      sampleKeys:
        data[0] != null && typeof data[0] === 'object'
          ? Object.keys(data[0] as Record<string, unknown>).slice(0, 12)
          : [],
    }
  }
  if (typeof data === 'object') {
    const o = data as Record<string, unknown>
    return {
      kind: 'object',
      keys: Object.keys(o),
      nestedLengths: {
        items: Array.isArray(o.items) ? o.items.length : null,
        data: Array.isArray(o.data) ? o.data.length : null,
        cards: Array.isArray(o.cards) ? o.cards.length : null,
        card: Array.isArray(o.card) ? o.card.length : null,
        list: Array.isArray(o.list) ? o.list.length : null,
      },
    }
  }
  return { kind: typeof data }
}

const logCardListFetch = (data: unknown, parsed: CardInfo[] | null, error?: unknown) => {
  if (!import.meta.env.DEV) return
  if (error != null) {
    if (axios.isAxiosError(error)) {
      console.error('[api/card] GET /api/card 실패', {
        status: error.response?.status,
        code: error.code,
        message: error.message,
        responseData: error.response?.data,
      })
    } else {
      console.error('[api/card] GET /api/card 실패', error)
    }
    return
  }
  console.info('[api/card] GET /api/card — 카드 목록', {
    raw: describeCardListRaw(data),
    parsedCount: parsed?.length ?? 0,
    parsedSample: (parsed ?? []).slice(0, 3).map((c) => ({
      cid: c.cid,
      cardNumber: c.cardNumber,
      name: c.name,
      empId: c.empId,
    })),
  })
}

export const getCardList = async (): Promise<CardInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/card')
    const parsed = parseCardList(data)
    logCardListFetch(data, parsed)
    return parsed
  } catch (error) {
    logCardListFetch(null, null, error)
    return null
  }
}

export const createCard = async (card: CreateCardRequest): Promise<boolean> => {
  const id = resolveCardId(card.cardNumber)
  if (id <= 0) return false
  try {
    await axiosInstance.post('/api/card', { card: createCardToWire(card) })
    return true
  } catch {
    return false
  }
}

export const updateCard = async (id: number, card: UpdateCardRequest): Promise<boolean> => {
  const nid = Math.trunc(id)
  if (!Number.isFinite(nid) || nid <= 0) return false
  try {
    await axiosInstance.put(`/api/card/${nid}`, { card: updateCardToWire(card, nid) })
    return true
  } catch {
    return false
  }
}

export const deleteCard = async (id: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/card/${id}`)
    return true
  } catch {
    return false
  }
}

export const getCardAccLvList = async (cid: number): Promise<CardAccLvInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>(`/api/card/${cid}/acclv`)
    return asRecordArray(data).map(normalizeCardAccLvRow)
  } catch {
    return null
  }
}

export const addCardAccLv = async (cid: number, acclv: AddCardAccLvRequest): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/card/${cid}/acclv`, {
      acclv: { cid, alvid: acclv.accLvId, state: 0 },
    })
    return true
  } catch {
    return false
  }
}

export const deleteCardAccLv = async (cid: number, alvid: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/card/${cid}/acclv/${alvid}`)
    return true
  } catch {
    return false
  }
}

/**
 * 카드를 지정 영역으로 이동.
 * 백엔드 제안: `POST /api/card/{cid}/area` body `{ areaId }`
 */
export const moveCardArea = async (
  cid: number,
  request: MoveCardAreaRequest,
): Promise<boolean> => {
  const nid = Math.trunc(cid)
  const areaId = Math.trunc(request.areaId)
  if (!Number.isFinite(nid) || nid <= 0 || !Number.isFinite(areaId) || areaId <= 0) {
    return false
  }

  try {
    await axiosInstance.post(`/api/card/${nid}/area`, { areaId })
    return true
  } catch {
    return false
  }
}
