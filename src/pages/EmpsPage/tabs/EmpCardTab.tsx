import { CardSummaryPanel } from '@/pages/CardsPage/components/CardSummaryHeader'
import { cardStatusLabel, cardTypeLabel } from '@/pages/CardsPage/utils/cardPageHelpers'
import type { CardInfo } from '@/types/api'

const FONT_SIZE = 15

interface EmpCardTabProps {
  cards: CardInfo[]
}

export const EmpCardTab = ({ cards }: EmpCardTabProps) => {
  if (cards.length === 0) {
    return (
      <p
        className="text-center py-4"
        style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}
      >
        발급된 카드가 없습니다
      </p>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full">
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto app-scrollbar w-full">
        {cards.map((card) => (
          <CardSummaryPanel
            key={card.cid > 0 ? card.cid : card.cardNumber}
            name={card.name ?? ''}
            cardNumber={card.cardNumber}
            type={cardTypeLabel(card)}
            status={cardStatusLabel(card)}
          />
        ))}
      </div>
    </div>
  )
}
