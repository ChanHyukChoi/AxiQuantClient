import { useTranslation } from 'react-i18next'
import { CreditCard, Plus } from 'lucide-react'
import { Badge } from '@/components/primitive/Badge'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
import {
  DrawerSummaryCardShell,
  drawerSummaryCardStyle,
} from '@/components/basic/DrawerSummaryCardShell'
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
import { DRAWER_SUMMARY_CARD_HEIGHT, DRAWER_SUMMARY_OUTER_GAP } from '@/lib/layout/splitDrawerDefaults'

/** @deprecated DRAWER_SUMMARY_CARD_HEIGHT 사용 */
export const CARD_SUMMARY_HEIGHT = DRAWER_SUMMARY_CARD_HEIGHT

const FONT_SIZE = 15

export interface CardSummaryPanelProps {
  name: string
  cardNumber: string
  type: string
  status: string
  isCreate?: boolean
}

/** 카드 드로어 최상단 요약 카드 — 목록·헤더 공통 */
export const CardSummaryPanel = ({
  name,
  cardNumber,
  type,
  status,
  isCreate = false,
}: CardSummaryPanelProps) => {
  const { t } = useTranslation(['card', 'common'])
  const displayName = isCreate
    ? name.trim() || t('card:summary.addTitle')
    : name.trim() || t('common:empty')
  const displayNumber = isCreate
    ? cardNumber.trim() || t('common:empty')
    : cardNumber.trim() || t('common:empty')
  const numberMono = !isCreate || Boolean(cardNumber.trim())
  const typeLabel = cardTypeDisplay(type, t)
  const statusLabel = cardStatusDisplay(status, t)

  return (
    <div
      className="w-full min-w-0 flex flex-col justify-between"
      style={drawerSummaryCardStyle}
    >
      <div className="min-w-0">
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
          className={['block leading-tight mt-1.5 truncate', numberMono ? 'font-mono' : '']
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
      </div>
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
      <DrawerSummaryCardShell centerContent>
        <DrawerSelectPrompt message={t('selectRow')} compact />
      </DrawerSummaryCardShell>
    )
  }

  const isCreate = mode === 'create'

  return (
    <div
      className="pb-3 w-full min-w-0"
      style={{ minHeight: DRAWER_SUMMARY_CARD_HEIGHT + DRAWER_SUMMARY_OUTER_GAP }}
    >
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
