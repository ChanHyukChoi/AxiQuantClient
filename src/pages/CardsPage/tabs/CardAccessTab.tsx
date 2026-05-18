import { MapPin, Shield } from 'lucide-react'
import { FRow, FieldValue, SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'

interface CardAccessTabProps {
  card: CardRow
  accLvNamesDisplay: string
}

export const CardAccessTab = ({ card, accLvNamesDisplay }: CardAccessTabProps) => {
  const area = card.area?.trim() ? card.area : '—'

  return (
    <div>
      <SectionTitle>접근 권한</SectionTitle>
      <FRow icon={<Shield size={12} />} label="권한 그룹">
        <FieldValue small>{accLvNamesDisplay}</FieldValue>
      </FRow>
      <div className="mt-4" />
      <SectionTitle>영역</SectionTitle>
      <FRow icon={<MapPin size={12} />} label="마지막 영역">
        <FieldValue small>{area}</FieldValue>
      </FRow>
    </div>
  )
}
