import type { CardInfo } from '@/types/api'

export const repCardOptionValue = (card: CardInfo): string =>
  card.cid > 0 ? String(card.cid) : card.cardNumber

export const repCardOptionLabel = (card: CardInfo): string => {
  const title = card.name?.trim() || card.cardNumber
  return `${title} (${card.cardNumber})`
}

export const defaultRepCardKey = (cards: CardInfo[]): string => {
  const first = cards[0]
  return first ? repCardOptionValue(first) : ''
}

export const findRepCard = (cards: CardInfo[], key: string): CardInfo | undefined =>
  cards.find((c) => repCardOptionValue(c) === key)
