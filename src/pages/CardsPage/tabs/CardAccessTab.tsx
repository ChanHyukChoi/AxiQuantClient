import { Shield } from 'lucide-react'
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
        <div className="flex items-center gap-1.5 mb-2">
          <Shield size={14} style={{ color: 'var(--color-text-subtle)' }} />
          <span
            className="text-[11px] font-medium"
            style={{ color: 'var(--color-text-muted)' }}
          >
            권한 그룹 {accLvItems.length > 0 ? `(${accLvItems.length})` : ''}
          </span>
        </div>
        <AccLvGroupCards items={accLvItems} fontSize={fontSize} />
      </section>

      <section>
        <SectionTitle fontSize={fontSize}>영역</SectionTitle>
        <LastAreaCard area={area} fontSize={fontSize} />
      </section>
    </div>
  )
}
