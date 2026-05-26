import { useMemo } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import {
  cardStatusLabel,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import type { ColumnDef } from '@/components/primitive/Grid'

const FONT_SIZE = 15

export const useCardColumns = (empNameMap: Record<number, string>) =>
  useMemo<ColumnDef<CardRow>[]>(
    () => [
      {
        key: 'cardNumber',
        header: '카드 번호',
        width: 110,
        sortable: true,
        hideable: false,
        render: (value) => (
          <span style={{ fontSize: FONT_SIZE, color: 'var(--color-accent)' }}>
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'name',
        header: '명칭',
        width: 90,
        sortable: true,
        render: (value) => (
          <span style={{ fontSize: FONT_SIZE, color: 'var(--color-text-cell)' }}>
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'empId',
        header: '카드 사용자',
        width: 90,
        sortable: true,
        render: (value, row) => {
          if (value == null) return ''
          return empNameMap[value as number] ?? row.empName ?? ''
        },
      },
      {
        key: 'type',
        header: '유형',
        width: 72,
        align: 'center',
        sortable: true,
        render: (_, row) => (
          <Badge variant={typeBadgeVariant(cardTypeLabel(row))}>
            {cardTypeLabel(row)}
          </Badge>
        ),
      },
      {
        key: 'isActive',
        header: '상태',
        width: 72,
        align: 'center',
        sortable: true,
        render: (_, row) => (
          <Badge variant={cardStatusLabel(row) === '활성' ? 'on' : 'off'}>
            {cardStatusLabel(row)}
          </Badge>
        ),
      },
      {
        key: 'lastAccess',
        header: '마지막 접근 일시',
        width: 130,
        sortable: true,
        render: (_, row) => (row.lastAccess?.trim() ? row.lastAccess : ''),
      },
    ],
    [empNameMap],
  )
