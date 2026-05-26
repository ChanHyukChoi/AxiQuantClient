import { MapPin, Shield } from 'lucide-react'
import { FRow, FieldValue, SectionTitle } from '@/pages/CardsPage/components/CardFieldUi'
import type { CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'

interface CardAccessTabProps {
  card: CardRow
  accLvNamesDisplay: string
  fontSize: number
}

export const CardAccessTab = ({
  card,
  accLvNamesDisplay,
  fontSize = 15,
}: CardAccessTabProps) => {
  const area = card.area?.trim() ? card.area : '—'

  return (
    <div>
      <SectionTitle fontSize={fontSize}>접근 권한</SectionTitle>
      <FRow icon={<Shield size={15} />} label="권한 그룹" fontSize={fontSize}>
        <FieldValue small fontSize={fontSize}>
          {accLvNamesDisplay}
        </FieldValue>
      </FRow>
      <div className="mt-4" />
      <SectionTitle fontSize={fontSize}>영역</SectionTitle>
      <FRow icon={<MapPin size={15} />} label="마지막 영역" fontSize={fontSize}>
        <FieldValue small fontSize={fontSize}>
          {area}
        </FieldValue>
      </FRow>
    </div>
  )
}
