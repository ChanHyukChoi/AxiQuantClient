import { useTranslation } from 'react-i18next'
import { CreditCard, Plus } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import {
  CARD_STATUS_ACTIVE,
  CARD_TYPE_DEFAULT,
} from '@/pages/CardsPage/formTypes'
import {
  cardStatusBadgeVariant,
  cardStatusDisplay,
  cardTypeDisplay,
} from '@/pages/CardsPage/utils/cardPageHelpers'

/** 추가·수정·조회 모드 공통 — Badge 행 포함 고정 높이 */
export const CARD_SUMMARY_HEIGHT = 108

const FONT_SIZE = 15

export interface CardSummaryPanelProps {
  name: string
  cardNumber: string
  type: string
  status: string
  isCreate?: boolean
  createHint?: string
}

/** 카드 드로어 최상단 요약 카드 — 목록·헤더 공통 */
export const CardSummaryPanel = ({
  name,
  cardNumber,
  type,
  status,
  isCreate = false,
  createHint,
}: CardSummaryPanelProps) => {
  const { t } = useTranslation(['card', 'common'])
  const hint = createHint ?? t('card:summary.createHint')
  const displayName = isCreate
    ? name.trim() || t('card:summary.addTitle')
    : name.trim() || t('common:empty')
  const displayNumber = isCreate ? cardNumber.trim() || hint : cardNumber.trim() || t('common:empty')
  const numberMono = !isCreate || Boolean(cardNumber.trim())
  const typeLabel = cardTypeDisplay(type, t)
  const statusLabel = cardStatusDisplay(status, t)

  return (
    <div
      className="w-full min-w-0 flex flex-col"
      style={{
        minHeight: CARD_SUMMARY_HEIGHT,
        border: '0.5px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-bg)',
        padding: '12px 14px',
      }}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {isCreate ? (
          <Plus
            size={16}
            className="flex-shrink-0"
            style={{ color: 'var(--color-accent)' }}
          />
        ) : (
          <CreditCard
            size={16}
            className="flex-shrink-0"
            style={{ color: 'var(--color-accent)' }}
          />
        )}
        <span
          className="font-medium leading-tight truncate min-w-0"
          style={{ color: 'var(--color-text)', fontSize: 20 }}
        >
          {displayName}
        </span>
      </div>
      <span
        className={['block leading-tight mt-1 truncate', numberMono ? 'font-mono' : '']
          .filter(Boolean)
          .join(' ')}
        style={{
          color: 'var(--color-text-muted)',
          letterSpacing: numberMono ? '0.05em' : undefined,
          paddingLeft: 22,
          fontSize: FONT_SIZE,
        }}
      >
        {displayNumber}
      </span>
      <div
        className="flex justify-end items-center mt-2 gap-1.5 flex-shrink-0"
        style={{ minHeight: 24 }}
      >
        <Badge variant={typeBadgeVariant(type)}>{typeLabel}</Badge>
        <Badge variant={cardStatusBadgeVariant(status)}>{statusLabel}</Badge>
      </div>
    </div>
  )
}

interface CardSummaryHeaderProps {
  mode: 'empty' | 'create' | 'view' | 'edit'
  name?: string
  cardNumber?: string
  type?: string
  status?: string
}

export const CardSummaryHeader = ({
  mode,
  name,
  cardNumber,
  type = CARD_TYPE_DEFAULT,
  status = CARD_STATUS_ACTIVE,
}: CardSummaryHeaderProps) => {
  const { t } = useTranslation('common')

  if (mode === 'empty') {
    return (
      <div className="pb-3 w-full min-w-0" style={{ minHeight: CARD_SUMMARY_HEIGHT + 12 }}>
        <div
          className="w-full min-w-0 flex items-center justify-center"
          style={{
            minHeight: CARD_SUMMARY_HEIGHT,
            border: '0.5px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-bg)',
            padding: '12px 14px',
          }}
        >
          <span style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}>
            {t('selectRow')}
          </span>
        </div>
      </div>
    )
  }

  const isCreate = mode === 'create'

  return (
    <div className="pb-3 w-full min-w-0">
      <CardSummaryPanel
        name={name ?? ''}
        cardNumber={cardNumber ?? ''}
        type={type}
        status={status}
        isCreate={isCreate}
      />
    </div>
  )
}
