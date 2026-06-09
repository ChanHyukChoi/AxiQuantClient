import {
  AccLvGroupCards,
  type CardAccLvDisplayItem,
} from '@/pages/CardsPage/components/AccLvGroupCards'
import { LastAreaCard } from '@/pages/CardsPage/components/LastAreaCard'
import { SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'

interface CardAccessTabProps {
  card: CardRow
  accLvItems: CardAccLvDisplayItem[]
  fontSize: number
}

export const CardAccessTab = ({
  card,
  accLvItems,
  fontSize = 15,
}: CardAccessTabProps) => {
  const area = card.area?.trim() ? card.area : '—'

  return (
    <div className="flex flex-col gap-4">
      <section>
        <SectionTitle fontSize={fontSize}>접근 권한</SectionTitle>
        <AccLvGroupCards items={accLvItems} fontSize={fontSize} />
        <div
          className="flex items-center mt-2"
          style={{
            padding: '5px 0',
            color: 'var(--color-text-cell)',
            fontSize: 15,
          }}
        >
          전체 {accLvItems.length}건
        </div>
      </section>

      <section>
        <SectionTitle fontSize={fontSize}>영역</SectionTitle>
        <LastAreaCard area={area} fontSize={fontSize} />
      </section>
    </div>
  )
}
