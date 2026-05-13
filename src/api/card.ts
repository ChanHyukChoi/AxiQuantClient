import { axiosInstance } from '@/lib/axios'
import type {
  AddCardAccLvRequest,
  CardAccLvInfo,
  CardInfo,
  CreateCardRequest,
  UpdateCardRequest,
} from '@/types/api'

export const getCardList = async (): Promise<CardInfo[] | null> => {
  try {
    const { data } = await axiosInstance.get<CardInfo[]>('/api/card')
    return data
  } catch {
    return null
  }
}

export const createCard = async (card: CreateCardRequest): Promise<boolean> => {
  try {
    await axiosInstance.post('/api/card', card)
    return true
  } catch {
    return false
  }
}

export const updateCard = async (
  id: number,
  card: UpdateCardRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/api/card/${id}`, card)
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
    const { data } = await axiosInstance.get<CardAccLvInfo[]>(`/api/card/${cid}/acclv`)
    return data
  } catch {
    return null
  }
}

export const addCardAccLv = async (
  cid: number,
  acclv: AddCardAccLvRequest,
): Promise<boolean> => {
  try {
    await axiosInstance.post(`/api/card/${cid}/acclv`, acclv)
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
