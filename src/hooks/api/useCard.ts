import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCardAccLv,
  createCard,
  deleteCard,
  deleteCardAccLv,
  getCardAccLvList,
  getCardList,
  updateCard,
} from '@/api/card'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AddCardAccLvRequest, CardAccLvInfo, CreateCardRequest, UpdateCardRequest } from '@/types/api'

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
