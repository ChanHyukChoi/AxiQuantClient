import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/primitive/Badge'
import { EmpPhotoSlot } from '@/pages/EmpsPage/components/EmpPhotoSlot'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import {
  cardStatusBadgeVariant,
  cardStatusDisplay,
  cardStatusLabel,
  cardTypeDisplay,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import type { ColumnDef } from '@/components/primitive/Grid'

const FONT_SIZE = 15

/** Grid 기본 컬럼 너비 — 유형은 커스텀 라벨 대비 상태보다 넓게 */
export const CARD_GRID_COLUMN_WIDTHS = {
  empPhoto: 44,
  cardNumber: 84,
  name: 110,
  empId: 120,
  type: 88,
  status: 56,
  area: 100,
  lastAccess: 145,
} as const

export const useCardColumns = (
  empNameMap: Record<number, string>,
  empPhotoById: Record<number, string | undefined>,
) => {
  const { t } = useTranslation(['card', 'common'])

  return useMemo<ColumnDef<CardRow>[]>(
    () => [
      {
        key: 'cardNumber',
        header: t('card:field.cardNumber'),
        width: CARD_GRID_COLUMN_WIDTHS.cardNumber,
        sortable: true,
        hideable: false,
        render: (value) => (
          <span
            className="font-mono truncate block"
            style={{ fontSize: FONT_SIZE, color: 'var(--color-accent)' }}
          >
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'name',
        header: t('card:field.name'),
        width: CARD_GRID_COLUMN_WIDTHS.name,
        sortable: true,
        render: (value) => (
          <span
            className="truncate block"
            style={{ fontSize: FONT_SIZE, color: 'var(--color-text-cell)' }}
          >
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'empPhoto',
        header: '',
        width: CARD_GRID_COLUMN_WIDTHS.empPhoto,
        sortable: false,
        hideable: true,
        render: (_, row) => {
          if (row.empId == null) return null
          return (
            <EmpPhotoSlot
              variant="grid"
              photoUrl={empPhotoById[row.empId]}
            />
          )
        },
      },
      {
        key: 'empId',
        header: t('card:field.emp'),
        width: CARD_GRID_COLUMN_WIDTHS.empId,
        sortable: true,
        render: (value, row) => {
          if (value == null) return ''
          const label = empNameMap[value as number] ?? row.empName ?? ''
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {label}
            </span>
          )
        },
      },
      {
        key: 'type',
        header: t('card:field.type'),
        width: CARD_GRID_COLUMN_WIDTHS.type,
        align: 'center',
        sortable: true,
        render: (_, row) => {
          const wire = cardTypeLabel(row)
          const label = cardTypeDisplay(wire, t)
          return (
            <Badge variant={typeBadgeVariant(wire)}>
              <span className="truncate block max-w-full">{label}</span>
            </Badge>
          )
        },
      },
      {
        key: 'status',
        header: t('card:field.status'),
        width: CARD_GRID_COLUMN_WIDTHS.status,
        align: 'center',
        sortable: true,
        render: (_, row) => {
          const wire = cardStatusLabel(row)
          const label = cardStatusDisplay(wire, t)
          return <Badge variant={cardStatusBadgeVariant(wire)}>{label}</Badge>
        },
      },
      {
        key: 'area',
        header: t('card:field.currentArea'),
        width: CARD_GRID_COLUMN_WIDTHS.area,
        sortable: true,
        render: (value) => {
          const text = typeof value === 'string' ? value.trim() : ''
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {text || t('common:empty')}
            </span>
          )
        },
      },
      {
        key: 'lastAccess',
        header: t('card:field.lastAccess'),
        width: CARD_GRID_COLUMN_WIDTHS.lastAccess,
        sortable: true,
        render: (_, row) => (
          <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
            {row.lastAccess?.trim() ? row.lastAccess : ''}
          </span>
        ),
      },
    ],
    [empNameMap, empPhotoById, t],
  )
}
