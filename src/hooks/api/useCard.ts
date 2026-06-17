import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCardAccLv,
  createCard,
  deleteCard,
  deleteCardAccLv,
  getCardAccLvList,
  getCardList,
  moveCardArea,
  updateCard,
} from '@/api/card'
import { queryKeys } from '@/lib/query/queryKeys'
import type {
  AddCardAccLvRequest,
  CardAccLvInfo,
  CreateCardRequest,
  MoveCardAreaRequest,
  UpdateCardRequest,
} from '@/types/api'

export const useCardList = () =>
  useQuery({ queryKey: queryKeys.card.all, queryFn: getCardList })

export const useCreateCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCardRequest) => createCard(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.card.all }),
  })
}

export const useUpdateCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCardRequest }) => updateCard(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.card.all }),
  })
}

export const useDeleteCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCard(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.card.all }),
  })
}

export const useCardAccLvList = (cid: number) =>
  useQuery<CardAccLvInfo[] | null, Error>({
    queryKey: queryKeys.card.acclv(cid),
    queryFn: () => getCardAccLvList(cid),
    enabled: cid > 0,
  })

export const useAddCardAccLv = (cid: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddCardAccLvRequest) => addCardAccLv(cid, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.card.acclv(cid) }),
  })
}

export const useDeleteCardAccLv = (cid: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (alvid: number) => deleteCardAccLv(cid, alvid),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.card.acclv(cid) }),
  })
}

export const useMoveCardArea = (cid: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: MoveCardAreaRequest) => moveCardArea(cid, data),
    onSuccess: (ok) => {
      if (!ok) return
      void qc.invalidateQueries({ queryKey: queryKeys.card.all })
      void qc.invalidateQueries({ queryKey: queryKeys.areas.all() })
    },
  })
}

/** 카드-접근권한 연결 diff 동기화 (생성·수정 저장 후) */
export const syncCardAccLvLinks = async (
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
