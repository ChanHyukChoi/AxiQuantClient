import { useTranslation } from 'react-i18next'
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
  cardStatusDisplay,
  cardStatusLabel,
  cardTypeDisplay,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'

const FONT_SIZE = 15

interface CardInfoTabProps {
  card: CardRow
  empNameMap: Record<number, string>
}

export const CardInfoTab = ({ card, empNameMap }: CardInfoTabProps) => {
  const { t } = useTranslation(['card', 'common'])
  const wireType = cardTypeLabel(card)
  const wireStatus = cardStatusLabel(card)
  const empLabel =
    card.empId != null
      ? (empNameMap[card.empId] ?? card.empName ?? t('common:empty'))
      : t('common:empty')
  const activeAt = card.issuedAt?.trim() ? card.issuedAt : t('common:empty')
  const inactiveAt = card.expiredAt?.trim() ? card.expiredAt : t('common:empty')

  return (
    <div>
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.info')}</SectionTitle>
      <FRow icon={<CreditCard size={15} />} label={t('card:field.cardNumber')} fontSize={FONT_SIZE}>
        <FieldValue mono fontSize={FONT_SIZE}>
          {card.cardNumber}
        </FieldValue>
      </FRow>
      <FRow icon={<Tag size={15} />} label={t('card:field.name')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>
          {card.name?.trim() ? card.name : t('common:empty')}
        </FieldValue>
      </FRow>
      <FRow icon={<Layers size={15} />} label={t('card:field.type')} fontSize={FONT_SIZE}>
        <Badge variant={typeBadgeVariant(wireType)}>{cardTypeDisplay(wireType, t)}</Badge>
      </FRow>
      <FRow icon={<CircleCheck size={15} />} label={t('card:field.status')} fontSize={FONT_SIZE}>
        <Badge variant={cardStatusBadgeVariant(wireStatus)}>
          {cardStatusDisplay(wireStatus, t)}
        </Badge>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.user')}</SectionTitle>
      <FRow icon={<User size={15} />} label={t('card:field.emp')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{empLabel}</FieldValue>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.period')}</SectionTitle>
      <FRow icon={<CalendarCheck size={15} />} label={t('card:field.activeAt')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{activeAt}</FieldValue>
      </FRow>
      <FRow icon={<CalendarX size={15} />} label={t('card:field.inactiveAt')} fontSize={FONT_SIZE}>
        <FieldValue fontSize={FONT_SIZE}>{inactiveAt}</FieldValue>
      </FRow>

      <div className="mt-4" />
      <SectionTitle fontSize={FONT_SIZE}>{t('card:section.options')}</SectionTitle>
      <FRow icon={<span />} label={t('card:field.exemptApb')} fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <CheckboxLook checked={!!card.exemptApb} />
        </span>
      </FRow>
      <FRow icon={<span />} label={t('card:field.exemptPin')} fontSize={FONT_SIZE}>
        <span className="flex justify-end">
          <CheckboxLook checked={!!card.exemptPin} />
        </span>
      </FRow>
    </div>
  )
}
