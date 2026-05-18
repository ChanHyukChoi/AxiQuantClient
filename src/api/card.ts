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

export const getCardList = async (): Promise<CardInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<unknown>('/api/card')
    return parseCardList(data)
  } catch {
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
