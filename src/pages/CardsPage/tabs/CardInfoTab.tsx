import {
  CalendarCheck,
  CalendarX,
  CircleCheck,
  CreditCard,
  Layers,
  Tag,
  User,
} from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import {
  CheckboxLook,
  FRow,
  FieldValue,
  SectionTitle,
  typeBadgeVariant,
} from '@/pages/CardsPage/components/CardFieldUi'
import {
  cardStatusBadgeVariant,
  cardStatusLabel,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'

const FONT_SIZE = 15

interface CardInfoTabProps {
  card: CardRow
  empNameMap: Record<number, string>
}

export const CardInfoTab = ({ card, empNameMap }: CardInfoTabProps) => {
  const t = cardTypeLabel(card)
  const s = cardStatusLabel(card)
  const empLabel =
    card.empId != null ? (empNameMap[card.empId] ?? card.empName ?? '—') : '—'
  const activeAt = card.issuedAt?.trim() ? card.issuedAt : '—'
  const inactiveAt = card.expiredAt?.trim() ? card.expiredAt : '—'

  return (
    <div>
      <SectionTitle fontSize={FONT_SIZE}>카드 정보</SectionTitle>
      <FRow icon={<CreditCard size={15} />} label="카드 번호" fontSize={FONT_SIZE}>
        <FieldValue mono fontSize={FONT_SIZE}>
          {card.cardNumber}
        </FieldValue>
      </FRow>
      <FRow icon={<Tag size={15} />} label="명칭" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{card.name?.trim() ? card.name : '—'}</FieldValue>
      </FRow>
      <FRow icon={<Layers size={15} />} label="유형" fontSize={FONT_SIZE}>
        <Badge variant={typeBadgeVariant(t)}>{t}</Badge>
      </FRow>
      <FRow icon={<CircleCheck size={15} />} label="상태" fontSize={FONT_SIZE}>
        <Badge variant={cardStatusBadgeVariant(s)}>{s}</Badge>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>사용자</SectionTitle>
      <FRow icon={<User size={15} />} label="카드 사용자" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{empLabel}</FieldValue>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>기간</SectionTitle>
      <FRow icon={<CalendarCheck size={15} />} label="활성 일시" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{activeAt}</FieldValue>
      </FRow>
      <FRow icon={<CalendarX size={15} />} label="비활성 일시" fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{inactiveAt}</FieldValue>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>옵션</SectionTitle>
      <FRow icon={<span />} label="APB 면제" fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <CheckboxLook checked={!!card.exemptApb} />
        </span>
      </FRow>
      <FRow icon={<span />} label="PIN 면제" fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <CheckboxLook checked={!!card.exemptPin} />
        </span>
      </FRow>
    </div>
  )
}
