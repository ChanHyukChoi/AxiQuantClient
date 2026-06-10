import { useMemo } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import {
  cardStatusBadgeVariant,
  cardStatusLabel,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import type { ColumnDef } from '@/components/primitive/Grid'

const FONT_SIZE = 15

/** Grid 기본 컬럼 너비 — 유형은 커스텀 라벨 대비 상태보다 넓게 */
export const CARD_GRID_COLUMN_WIDTHS = {
  cardNumber: 84,
  name: 110,
  empId: 50,
  type: 56,
  status: 56,
  area: 100,
  lastAccess: 145,
} as const

export const useCardColumns = (empNameMap: Record<number, string>) =>
  useMemo<ColumnDef<CardRow>[]>(
    () => [
      {
        key: 'cardNumber',
        header: '카드 번호',
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
        header: '명칭',
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
        key: 'empId',
        header: '카드 사용자',
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
        header: '유형',
        width: CARD_GRID_COLUMN_WIDTHS.type,
        align: 'center',
        sortable: true,
        render: (_, row) => {
          const label = cardTypeLabel(row)
          return (
            <Badge variant={typeBadgeVariant(label)}>
              <span className="truncate block max-w-full">{label}</span>
            </Badge>
          )
        },
      },
      {
        key: 'status',
        header: '상태',
        width: CARD_GRID_COLUMN_WIDTHS.status,
        align: 'center',
        sortable: true,
        render: (_, row) => {
          const label = cardStatusLabel(row)
          return <Badge variant={cardStatusBadgeVariant(label)}>{label}</Badge>
        },
      },
      {
        key: 'area',
        header: '현재 영역',
        width: CARD_GRID_COLUMN_WIDTHS.area,
        sortable: true,
        render: (value) => {
          const text = typeof value === 'string' ? value.trim() : ''
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {text || '—'}
            </span>
          )
        },
      },
      {
        key: 'lastAccess',
        header: '마지막 접근 일시',
        width: CARD_GRID_COLUMN_WIDTHS.lastAccess,
        sortable: true,
        render: (_, row) => (
          <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
            {row.lastAccess?.trim() ? row.lastAccess : ''}
          </span>
        ),
      },
    ],
    [empNameMap],
  )
