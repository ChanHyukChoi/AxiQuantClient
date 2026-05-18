import { CardItem } from '@/pages/EmpsPage/components/EmpFieldUi'
import type { CardInfo } from '@/types/api'

interface EmpCardTabProps {
  cards: CardInfo[]
}

export const EmpCardTab = ({ cards }: EmpCardTabProps) => {
  if (cards.length === 0) {
    return (
      <p className="text-[12px] text-center py-4" style={{ color: 'var(--color-text-subtle)' }}>
        발급된 카드가 없습니다
      </p>
    )
  }

  return (
    <div>
      {cards.map((card) => (
        <CardItem key={card.cid} card={card} />
      ))}
    </div>
  )
}
